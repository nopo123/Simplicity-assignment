import {
  buildLikePattern,
  escapeLikeTerm,
} from 'src/announcement/utils/search-term.util';

describe('escapeLikeTerm', () => {
  it('leaves a plain term untouched', () => {
    expect(escapeLikeTerm('water supply')).toBe('water supply');
  });

  it('escapes the percent wildcard so it matches literally', () => {
    expect(escapeLikeTerm('50%')).toBe('50\%');
  });

  it('escapes the underscore wildcard so it matches literally', () => {
    expect(escapeLikeTerm('main_street')).toBe('main\_street');
  });

  it('escapes a backslash before the wildcards', () => {
    expect(escapeLikeTerm('a\b')).toBe('a\\b');
  });

  it('escapes every wildcard occurrence, not only the first', () => {
    expect(escapeLikeTerm('%a_b%')).toBe('\%a\_b\%');
  });

  it('returns an empty string unchanged', () => {
    expect(escapeLikeTerm('')).toBe('');
  });
});

describe('buildLikePattern', () => {
  it('wraps the escaped term in contains wildcards', () => {
    expect(buildLikePattern('water')).toBe('%water%');
  });

  it('keeps the surrounding wildcards unescaped while escaping the term', () => {
    expect(buildLikePattern('50%')).toBe('%50\%%');
  });
});
