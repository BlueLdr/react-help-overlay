import { useCallback, useId } from "react";

import { HELP_ACTIVE_SCOPE_ROOT_ATTRIBUTE } from "../utils";
import { useHelpActions, useHelpState } from "./useHelpContext";

//================================================

export const useHelpScopeElement = (): [
  ref: React.RefCallback<HTMLElement>,
  attrs?: Record<typeof HELP_ACTIVE_SCOPE_ROOT_ATTRIBUTE, "true">,
] => {
  const { scopeRoot } = useHelpState();
  const { setHelpElementScope } = useHelpActions();
  const id = useId();

  const ref = useCallback<React.RefCallback<HTMLElement>>(
    (element: HTMLElement | null) => {
      setHelpElementScope(id, element);
    },
    [setHelpElementScope, id],
  );

  if (scopeRoot.id === id) {
    return [ref, { [HELP_ACTIVE_SCOPE_ROOT_ATTRIBUTE]: "true" }];
  }

  return [ref, undefined];
};
