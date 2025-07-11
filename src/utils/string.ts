export const pascalCase = (str: string) => {
  return (
    str
      .match(
        /[A-Z]{2,}(?=[A-Z][a-z]+[0-9]*|\b)|[A-Z]?[a-z]+[0-9]*[a-z]*|[A-Z]|[0-9]+[a-z]*/g
      )
      ?.map(x => x.charAt(0).toUpperCase() + x.slice(1).toLowerCase())
      .join('') || ''
  );
};
