import { useCallback, useMemo, useState } from "react";

import { useValueRef } from "../utils/hooks";
import { useHelpActions, useHelpConfig, useHelpData, useHelpState } from "./useHelpContext";
import { useHelpScopeZIndex } from "./useHelpScopeZIndex";

import type { ActiveHelpItem, HelpItemKey } from "../types";

//================================================

export type UseHelpPopupCallbacks = {
  /**
   * Navigates the help popup to the given help item;
   * For use inside help entries to "link" to other help entries
   */
  goToHelpPage: (key: HelpItemKey | null) => void;
  /** Returns to the previous help item; If there is no history to go back to, this will be undefined */
  goBack?: () => void;
  closePopup: () => void;
};

/** Handles the state and zIndex of the help popup */
export const useHelpPopup = (): [
  open: boolean,
  attrs: Pick<React.HTMLProps<HTMLElement>, "style">,
  callbacks: UseHelpPopupCallbacks,
] => {
  const { openHelpItem } = useHelpActions();
  const { activeItem } = useHelpState();
  const { items } = useHelpData();
  const { zIndexOverrides } = useHelpConfig();
  const itemsRef = useValueRef(items);

  const [history, setHistory] = useState<ActiveHelpItem[]>([]);
  const historyRef = useValueRef(history);

  const activeItemRef = useValueRef(activeItem);

  const closePopup = useCallback(() => {
    setHistory([]);
    return openHelpItem(null);
  }, [openHelpItem]);

  const goToHelpPage = useCallback(
    (key: HelpItemKey | null) => {
      if (key === null) {
        return closePopup();
      }
      // if the new item is valid and a current item is being viewed, push the current item onto the
      // history stack
      // TODO: First condition here may actually be unwanted
      if (itemsRef.current[key] && activeItemRef.current) {
        setHistory(prevHistory =>
          activeItemRef.current ? prevHistory.concat(activeItemRef.current) : prevHistory
        );
      }
      // Help items opened via "link" are never opened `asTutorial` because they were manually
      // opened by the user
      return openHelpItem(key, false);
    },
    [activeItemRef, itemsRef, openHelpItem, closePopup]
  );

  const goBack = useCallback(() => {
    const newHistory = historyRef.current.slice(0);
    // pop until we reach a valid item in the history (mostly for type checking)
    let prevItem = newHistory.pop();
    while (prevItem && !itemsRef.current[prevItem.key] && newHistory.length > 0) {
      prevItem = newHistory.pop();
    }
    // if no valid item is found, close the popup
    if (!prevItem || !itemsRef.current[prevItem.key]) {
      return closePopup();
    }
    setHistory(newHistory);
    // navigate to the previous item and restore its `isOpenedAsTutorial` state
    return openHelpItem(prevItem.key, prevItem.isOpenedAsTutorial);
  }, [historyRef, itemsRef, openHelpItem, closePopup]);

  const callbacks = useMemo(
    () => ({
      goToHelpPage,
      goBack: historyRef.current.length > 0 ? goBack : undefined,
      closePopup,
    }),
    [goBack, goToHelpPage, closePopup, historyRef]
  );

  const style = useHelpScopeZIndex(zIndexOverrides.popup);
  const attrs = useMemo<Pick<React.HTMLProps<HTMLElement>, "style">>(() => ({ style }), [style]);

  return [!!activeItem, attrs, callbacks];
};
