import { HELP_STYLES_PSEUDO_ELEMENT_CSS_VAR_NAME } from "../utils";
import { useHelpState } from "./useHelpContext";

//================================================

export const useHelpScopeZIndex = (
  offset = 0,
): React.HTMLProps<HTMLElement>["style"] | undefined => {
  const { scopeRoot, helpOverlayActive } = useHelpState();
  const zIndex = scopeRoot.zIndex + offset;
  return helpOverlayActive
    ? {
        zIndex,
        // @ts-expect-error: setting a css var
        [HELP_STYLES_PSEUDO_ELEMENT_CSS_VAR_NAME]: zIndex + 1,
      }
    : undefined;
};
