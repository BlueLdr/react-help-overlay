import { HELP_STYLES_PSEUDO_ELEMENT_CSS_VAR_NAME } from "../utils";
import { useHelpState } from "./useHelpContext";

//================================================

/**
 * Calculates the zIndex-related styles to pass to an element when the help overlay is open.
 * @param [offset] Optional offset to add to the zIndex of the scope root
 *                 @see [Rendering layers](../../../README.md#rendering-layers)
 */
export const useHelpScopeZIndex = (
  offset = 0
): React.HTMLProps<HTMLElement>["style"] | undefined => {
  const { scopeRoot, helpOverlayActive } = useHelpState();
  const zIndex = scopeRoot.zIndex + offset;
  return helpOverlayActive
    ? {
        zIndex,
        // set the zIndex for pseudo-elements to n + 1
        // @ts-expect-error: setting a css var
        [HELP_STYLES_PSEUDO_ELEMENT_CSS_VAR_NAME]: zIndex + 1,
      }
    : undefined;
};
