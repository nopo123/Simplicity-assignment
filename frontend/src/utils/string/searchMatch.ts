export const matchesSearch = (value: string, searchTerm: string): boolean => {
  if (!searchTerm) return true;

  return value.toLowerCase().includes(searchTerm.toLowerCase());
};
