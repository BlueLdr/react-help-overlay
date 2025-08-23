import { useCallback, useMemo } from "react";

import { HELP_BUTTON_STYLES_CLASS_NAME, joinClassNames } from "../utils";
import { useValueRef } from "../utils/hooks";
import { useHelpActions, useHelpConfig, useHelpState } from "./useHelpContext";

//================================================

/** Get the button props for the Help Button (styles/classes, id, and click listener) */
export const useHelpButton = () => {
  const { helpButtonId, helpButtonClassName, disableBuiltInStyles, zIndexOverrides } =
    useHelpConfig();
  const { helpOverlayActive, scopeRoot } = useHelpState();
  const { setHelpOverlayActive } = useHelpActions();

  const activeRef = useValueRef(helpOverlayActive);

  const onClick = useCallback(
    () => setHelpOverlayActive(!activeRef.current),
    [activeRef, setHelpOverlayActive]
  );

  const scopeZIndex = scopeRoot.zIndex;
  const buttonProps = useMemo(
    () =>
      ({
        id: helpButtonId,
        className: joinClassNames(
          !disableBuiltInStyles && HELP_BUTTON_STYLES_CLASS_NAME,
          helpButtonClassName
        ),
        style: { zIndex: scopeZIndex + zIndexOverrides.button },
        onClick,
      }) satisfies React.ComponentProps<"button">,
    [helpButtonId, disableBuiltInStyles, helpButtonClassName, scopeZIndex, onClick]
  );

  return [buttonProps, helpOverlayActive] as const;
};
