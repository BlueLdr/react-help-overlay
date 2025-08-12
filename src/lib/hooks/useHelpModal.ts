import { useCallback, useMemo, useState } from "react";

import { HELP_MODAL_Z_INDEX_OFFSET } from "../utils";
import { useValueRef } from "../utils/hooks";
import { useHelpActions, useHelpData, useHelpState } from "./useHelpContext";
import { useHelpScopeZIndex } from "./useHelpScopeZIndex";

import type { ActiveHelpItem, HelpItemKey } from "../types";

//================================================

export type UseHelpModalCallbacks = {
  goToHelpPage: (key: HelpItemKey | null) => void;
  /** If there is no history to go back to, this will be undefined */
  goBack?: () => void;
  closeModal: () => void;
};

export const useHelpModal = (): [
  open: boolean,
  attrs: Pick<React.HTMLProps<HTMLElement>, "style">,
  callbacks: UseHelpModalCallbacks,
] => {
  const { openHelpItem } = useHelpActions();
  const { activeItem } = useHelpState();
  const { items } = useHelpData();
  const itemsRef = useValueRef(items);

  const [history, setHistory] = useState<ActiveHelpItem[]>([]);
  const historyRef = useValueRef(history);

  const activeItemRef = useValueRef(activeItem);

  const closeModal = useCallback(() => {
    setHistory([]);
    return openHelpItem(null);
  }, [openHelpItem]);

  const goToHelpPage = useCallback(
    (key: HelpItemKey | null) => {
      if (key === null) {
        return closeModal();
      }
      if (itemsRef.current[key] && activeItemRef.current) {
        setHistory((prevHistory) =>
          activeItemRef.current
            ? prevHistory.concat(activeItemRef.current)
            : prevHistory,
        );
      }
      return openHelpItem(key, false);
    },
    [activeItemRef, itemsRef, openHelpItem, closeModal],
  );

  const goBack = useCallback(() => {
    const newHistory = historyRef.current.slice(0);
    let prevItem = newHistory.pop();
    while (
      prevItem &&
      !itemsRef.current[prevItem.key] &&
      newHistory.length > 0
    ) {
      prevItem = newHistory.pop();
    }
    if (!prevItem || !itemsRef.current[prevItem.key]) {
      return closeModal();
    }
    setHistory(newHistory);
    return openHelpItem(prevItem.key, prevItem.isOpenedAsTutorial);
  }, [historyRef, itemsRef, openHelpItem, closeModal]);

  const callbacks = useMemo(
    () => ({
      goToHelpPage,
      goBack: historyRef.current.length > 0 ? goBack : undefined,
      closeModal,
    }),
    [goBack, goToHelpPage, closeModal, historyRef],
  );

  const style = useHelpScopeZIndex(HELP_MODAL_Z_INDEX_OFFSET);
  const attrs = useMemo<Pick<React.HTMLProps<HTMLElement>, "style">>(
    () => ({ style }),
    [style],
  );

  return [!!activeItem, attrs, callbacks];
};
