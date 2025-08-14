import { useCallback, useId } from "react";

import { HELP_ACTIVE_SCOPE_ROOT_ATTRIBUTE } from "../utils";
import { useHelpActions, useHelpState } from "./useHelpContext";

//================================================

/**
 * Returns a ref and attributes to pass to an element to set that element as the scope root for
 * help overlay items.
 * E.g. When you open a modal, then open the help overlay, you only want the help overlay to
 * highlight elements inside that modal, and ignore other help items on the page. Setting the modal
 * as the scope root will trigger that behavior.
 */
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
    [setHelpElementScope, id]
  );

  // if this element is the active scope root, set the scope root attribute on the element.
  if (scopeRoot.id === id) {
    return [ref, { [HELP_ACTIVE_SCOPE_ROOT_ATTRIBUTE]: "true" }];
  }

  return [ref, undefined];
};
