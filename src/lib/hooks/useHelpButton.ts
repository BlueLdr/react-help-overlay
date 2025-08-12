import { useCallback, useMemo } from "react";

import {
  HELP_BUTTON_STYLES_CLASS_NAME,
  HELP_BUTTON_Z_INDEX_OFFSET,
  joinClassNames,
} from "../utils";
import { useValueRef } from "../utils/hooks";
import { useHelpActions, useHelpConfig, useHelpState } from "./useHelpContext";

//================================================

export const useHelpButton = () => {
  const { helpButtonId, helpButtonClassName, disableBuiltInStyles } = useHelpConfig();
  const { helpOverlayActive, scopeRoot } = useHelpState();
  const { setHelpOverlayActive } = useHelpActions();

  const activeRef = useValueRef(helpOverlayActive);

  const onClick = useCallback(
    () => setHelpOverlayActive(!activeRef.current),
    [activeRef, setHelpOverlayActive],
  );

  const scopeZIndex = scopeRoot.zIndex;
  const buttonProps = useMemo(
    () =>
      ({
        id: helpButtonId,
        className: joinClassNames(
          !disableBuiltInStyles && HELP_BUTTON_STYLES_CLASS_NAME,
          helpButtonClassName,
        ),
        style: { zIndex: scopeZIndex + HELP_BUTTON_Z_INDEX_OFFSET },
        onClick,
      }) satisfies React.ComponentProps<"button">,
    [helpButtonId, disableBuiltInStyles, helpButtonClassName, scopeZIndex, onClick],
  );

  return [buttonProps, helpOverlayActive] as const;
};
