import { useEffect } from "react";

import { getHelpItemDataFromElement } from "../utils";
import { useValueRef } from "../utils/hooks";
import { useHelpActions, useHelpState } from "./useHelpContext";
import { useHelpMarkAsComplete } from "./useHelpMarkAsComplete";

//================================================

const captureOptions: EventListenerOptions = { capture: true };

/** Handles the click listener for tutorials */
export const useHelpTutorials = () => {
  const { helpOverlayActive, activeItem, tutorialsDisabled } = useHelpState();
  const { openHelpItem } = useHelpActions();

  const enableListenerRef = useValueRef(!activeItem && !helpOverlayActive && !tutorialsDisabled);

  useHelpMarkAsComplete();

  // "Escape" key listener to close overlay when it's active
  useEffect(() => {
    if (!enableListenerRef.current) {
      return;
    }

    const onClickItem: EventListener = event => {
      // if the help overlay or another help item is active, abort
      if (enableListenerRef.current || !(event.target instanceof HTMLElement)) {
        return;
      }

      // get the help metadata for the clicked element
      const [key, isTutorial] = getHelpItemDataFromElement(event.target);
      if (!key || !isTutorial) {
        return;
      }

      openHelpItem(key, true);
    };

    window.addEventListener("click", onClickItem, captureOptions);
    return () => {
      window.removeEventListener("click", onClickItem, captureOptions);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [enableListenerRef, openHelpItem, enableListenerRef.current]);
};
