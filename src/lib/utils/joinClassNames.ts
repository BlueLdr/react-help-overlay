/** Joins an array of potential classNames into a properly formatted className string */
export const joinClassNames = (...classNames: (string | undefined | null | false)[]) =>
  classNames.reduce<string | undefined>((result, str) => {
    if (!str) {
      return result;
    }
    const trimmed = str?.trim();
    if (!trimmed) {
      return result;
    }
    return result ? `${result} ${trimmed}` : trimmed;
  }, undefined);
