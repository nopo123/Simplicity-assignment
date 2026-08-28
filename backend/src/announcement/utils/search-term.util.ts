export const escapeLikeTerm = (term: string): string =>
  term.replace(/[\\%_]/g, (character) => `\\${character}`);

export const buildLikePattern = (term: string): string =>
  `%${escapeLikeTerm(term)}%`;
