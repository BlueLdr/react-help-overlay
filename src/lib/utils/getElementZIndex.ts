export const getElementZIndex = (elem: HTMLElement): number => {
  if (typeof getComputedStyle === "undefined") {
    return 0;
  }
  const computedStyles = getComputedStyle(elem);
  const zIndex = Number(computedStyles.zIndex);
  return isNaN(zIndex) ? 0 : zIndex;
};
