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

## Screens

| Route | What it does |
|---|---|
| `/announcements` | Table sorted by *Last update* descending, with a text search and a category filter |
| `/announcements/new` | Empty form for a new announcement |
| `/announcements/:id` | The same form, prefilled from the announcement |

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

## Publication date format

`MM/DD/YYYY HH:mm` is written exactly once, in
[src/config/date.config.ts](src/config/date.config.ts). Everything else derives from it — the input
placeholder, the strict dayjs parse in the Yup test, the interpolated error message, both date
columns of the table, and the conversion to ISO 8601 on submit. Grepping the source for the literal
must return that one file:

```bash
grep -rn "MM/DD/YYYY" src
```

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

The websocket notification is deliberately **not** shown to the client that created the
announcement — that client already gets its own success message, and two toasts for one action is
noise. Each browser tab generates a client id in [src/lib/clientId.ts](src/lib/clientId.ts), axios
sends it on every request as `x-client-id`, and the gateway echoes it back as the second argument of
`announcementCreated`, which the notification hook compares against its own id.

So to see the notification, create the announcement from a *different* client: Swagger, Postman, or a
second browser tab. A snackbar appears and the table refreshes on its own.

The Publish button stays disabled until something actually changes (`formik.dirty`), and a failed
validation shows the message under each field rather than a snackbar.
