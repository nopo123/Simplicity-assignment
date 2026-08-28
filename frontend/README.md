# Announcements — Frontend

React + Vite + MUI single-page app for the announcements table and the announcement form.

## Running the project

The backend has to be reachable first — see [../backend/README.md](../backend/README.md).

```bash
cp .env.example .env
npm ci
npm run dev
```

The app runs on http://localhost:3001.

| Variable | Example | Meaning |
|---|---|---|
| `VITE_BACKEND_HOST` | `http://localhost:3000` | Base URL of the API and of the websocket namespace. Vite inlines it at **build** time, so the Docker image takes it as a build argument, not a runtime environment variable |

## Docker image

The image is multi-stage: Node builds `dist`, nginx serves it. Two things in
[.docker/nginx.conf](.docker/nginx.conf) are not obvious.

**SPA routing.** `try_files $uri /index.html` is what makes a hard refresh on `/announcements/5`
return the app instead of an nginx 404 — that path exists only in the client-side router.

**Caching.** `/assets/` holds two kinds of file and they need opposite policies:

| Path | Cache-Control | Why |
|---|---|---|
| `/assets/icons/` | `public, no-cache` | copied verbatim from `public/`, so `edit.svg` keeps that name forever |
| `/assets/` | `public, max-age=31536000, immutable` | Vite bundles carry a content hash, so a changed file has a new name |

nginx matches the longest prefix, so the icons fall into the first rule. `no-cache` does not mean
"do not store" — the browser keeps the file and revalidates, and nginx answers `304` from the ETag.

Marking the icons `immutable` is a trap worth naming: it tells the browser never to revalidate, not
even on a normal reload, so a redrawn icon keeps rendering the old shape for a year no matter how
many times the image is rebuilt.

## Screens

| Route | What it does | Document title |
|---|---|---|
| `/announcements` | Table sorted by *Last update* descending, with a text search and a category filter | Announcements |
| `/announcements/new` | Empty form for a new announcement | Create the announcement |
| `/announcements/:id` | The same form, prefilled from the announcement | Edit the announcement |

Each page sets its own browser-tab title through
[PageTitle](src/components/customs/PageTitle.tsx), a thin wrapper over `react-helmet-async`. It
takes the already-translated string so the `t` call stays on the page, and the static `<title>` in
`index.html` remains the pre-hydration fallback.

## Layout notes from the design

The active sidebar item is not a small pill — it fills the remaining height of the sidebar and
carries an **elliptical** right-hand radius (`0 100% 100% 0 / 0 32% 32% 0`), which is what produces
the large amber shape in the design. A plain `border-radius: 999px` would give a straight edge with
a semicircular cap instead of the continuous curve.

The table keeps every text dark — header labels included — and renders categories as a plain
comma-separated list rather than chips. Chips appear only in the category multiselect, which is
where the design shows them.

## Responsive behaviour

Breakpoints live in [src/config/config.ts](src/config/config.ts) as `MEDIA_DOWN_SM` (600px) and
`MEDIA_DOWN_MD` (900px), used from the style objects so they work in `sx` and in styled components
alike.

- below 900px the sidebar is hidden and the same `Nav` is rendered inside a temporary MUI `Drawer`,
  opened from the hamburger in the content header; picking an item closes it
- the table scrolls horizontally inside its `TableContainer` and keeps a minimum width, so columns
  are never crushed — the `overflow` belongs on the container, not on the `Table`
- below 600px the search field and the category filter go full width and stack vertically
- page and form padding shrink at each step
- selected category chips wrap inside the select instead of spilling out of its border

## Theme

The amber palette lives in [src/theme/palette/palette-default.ts](src/theme/palette/palette-default.ts)
and the greys in [src/theme/palette.ts](src/theme/palette.ts). `ThemeCssVarsProvider` walks
`theme.palette` and writes every leaf onto `document.documentElement`, which is why `cssVar()`
resolves to `var(---primary-main)` with three dashes. Colours in styles always go through
`cssVar()`, never as literals.

`warning.main` is a burnt orange rather than a yellow on purpose: next to an amber `primary.main` a
yellow warning would be indistinguishable from a call to action.

The font is **Lato**, loaded from Google Fonts in [index.html](index.html).

## Publication date

`MM/DD/YYYY HH:mm` is written exactly once, in
[src/config/date.config.ts](src/config/date.config.ts). Grepping the source for the literal must
return that one file:

```bash
grep -rn "MM/DD/YYYY" src
```

It is also the **wire format**, so the form sends the string the user typed without converting it.
That is what makes frontend and backend validation genuinely identical rather than merely similar:
both run the same algorithm over the same string.

[src/utils/date/publicationDateValidation.ts](src/utils/date/publicationDateValidation.ts) is a
**mirror** of `backend/src/common/utils/publication-date.util.ts` — same pattern, same range
constants, same check order, same error codes. The two files must stay identical; the backend unit
test `test/common/publication-date-test.validation.unit.spec.ts` pins the behaviour both sides
implement.

The validator returns a specific error rather than a single "invalid date", so the field says what
is actually wrong:

| Input | Message |
|---|---|
| `` (empty) | Publication date is required |
| `8/28/2026 08:55` | Use the format MM/DD/YYYY HH:mm |
| `13/31/2001 21:11` | Month must be between 01 and 12 |
| `01/32/2026 10:00` | Day must be between 01 and 31 |
| `02/29/2001 10:00` | That month only has 28 days |
| `01/15/2026 24:00` | Hours must be between 00 and 23 |
| `01/15/2026 10:60` | Minutes must be between 00 and 59 |

Each message is an i18n key with interpolated bounds, so the limits are never hardcoded into a
sentence.

### Wire format versus display format

`MM/DD/YYYY HH:mm` is what the form edits, validates and sends. The **table** shows something else:
the design spells the month out, so `formatPublicationDate` and `formatLastUpdate` in
[src/utils/date/dateFormat.ts](src/utils/date/dateFormat.ts) render through the built-in
`Intl.DateTimeFormat` instead.

| Column | Source | Shown as |
|---|---|---|
| Publication date | `MM/DD/YYYY HH:mm`, UTC | `Aug 11, 2023 04:38` |
| Last update | `updated`, ISO 8601 | `Aug 11, 2023` |

Two formatters are composed rather than one, because a single `Intl` call puts a comma between the
date and the time (`Aug 11, 2023, 04:38`) and the design has none. Both are pinned to `en-US` and to
`UTC`: the locale so the column does not change shape with the interface language, and the time zone
so the two columns can never disagree about which day something happened — publication dates are
UTC by contract, and a viewer east of Greenwich would otherwise see a local `updated` day that does
not line up with them.

The formatters are built once at module level; constructing an `Intl.DateTimeFormat` per row is the
expensive part, formatting with it is not.

## Search debouncing

`useDebouncedCallback` wraps lodash `debounce` and exposes the debounced function itself, so callers
get `.cancel()`. `useAnnouncements` calls it in three places:

- clearing the search — otherwise an in-flight debounce would land after the reset and re-apply the
  old term
- changing the category filter — the pending search is flushed to the current input instead of
  arriving late
- unmount, inside the hook's own cleanup

## Generic components

Pages and forms never render a raw MUI `TextField`. Every input goes through a generic component so
the styling, error state and behaviour live in one place:

| Component | Used for |
|---|---|
| [FormikTextField](src/components/form/FormikTextField.tsx) | title, content (multiline), publication date |
| [SearchField](src/components/customs/SearchField.tsx) | the fulltext search, including the clear button |
| [MultiAutocomplete](src/components/selects/MultiAutocomplete.tsx) | categories in the form **and** as a list filter |

```bash
grep -rn "<TextField" src/pages src/components/announcement src/components/form/announcement
```

That returns nothing.

## Conventions

- One component per file, one hook per file
- `useTranslation()` is called on the page (or at the root of a subtree) and `t` is passed down as a
  prop; hooks own the `t` they need for their own snackbars
- No inline `style={{}}` and no raw `sx` with several hand-typed CSS values — those become styled
  components in [src/styles/customStyledComponent.ts](src/styles/customStyledComponent.ts)
- Components never call `useQuery` / `useMutation` or an `api/*` function; that lives in
  `src/hooks/{feature}/`
- Query keys come from [src/hooks/common/queryKeys.ts](src/hooks/common/queryKeys.ts) and route
  paths from [src/routes/paths.ts](src/routes/paths.ts) — a cache key is a contract between a reader
  and whatever invalidates it, and a renamed literal would break invalidation with no type error
- The generic error snackbar lives in
  [src/hooks/common/useErrorSnackbar.ts](src/hooks/common/useErrorSnackbar.ts); hooks only spell out
  messages that are genuinely specific to them
- Icons are single-colour SVG masks in `public/assets/icons/`, rendered through `SvgColor` and the
  `icon()` helper, so they take their colour from `currentColor`
- Feature-local config, types and utils sit inside the feature folder; `src/config/` holds only what
  is genuinely global
- Category codes are **not** duplicated on the frontend — the backend is the single source of truth
  and the app renders whatever `labels` the API returns

## Layers

```
src/
├── api/            axios calls, one file per resource
├── components/     presentational + generic components, feature folders own their config/types/utils
├── config/         global config only (debounce, page size, dimensions, date format, env)
├── hooks/          all server access and stateful orchestration
├── layouts/        dashboard shell and sidebar
├── lib/            axios instance, query client
├── pages/          route-level components
├── routes/         route table and lazy sections
├── styles/         global style objects and styled components
├── theme/          palette, typography, shadows, MUI overrides
├── types/          shared API/domain shapes
└── utils/          pure helpers, split by concern
```

## Verification

```bash
npm run typecheck
npm run lint
```

Exactly one snackbar per action, never two:

| Action | Feedback |
|---|---|
| create | the websocket `announcementCreated` notification, shown to every connected client including the author |
| update | success snackbar |
| delete | success snackbar |
| failed request | error snackbar |
| failed validation | the message under each field, no snackbar |

Create deliberately has no success snackbar of its own — the websocket notification already covers
it, and raising both meant two toasts stacked on top of each other for one click.

The Publish button stays disabled until something actually changes (`formik.dirty`), so an unchanged
announcement cannot be saved.
