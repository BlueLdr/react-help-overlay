import { useEffect } from "react";

import { useValueRef } from "../utils/hooks";
import { useHelpActions, useHelpData, useHelpState } from "./useHelpContext";

//================================================

export const useHelpMarkAsComplete = () => {
  const { activeItem } = useHelpState();
  const { markItemComplete } = useHelpActions();
  const { items } = useHelpData();

  const itemsRef = useValueRef(items);

  useEffect(() => {
    if (activeItem && itemsRef.current[activeItem.key]?.isTutorial) {
      markItemComplete(activeItem.key)
    }
  }, [activeItem, itemsRef, markItemComplete]);
}
