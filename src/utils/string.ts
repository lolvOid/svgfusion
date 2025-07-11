export const pascalCase = (str: string): string => {
  return str
    .replace(/(?:^\w|[A-Z]|\b\w)/g, (match, index) =>
      index === 0 ? match.toUpperCase() : match.toLowerCase()
    )
    .replace(/\s+/g, '');
};
