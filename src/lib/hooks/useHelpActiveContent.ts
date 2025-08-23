import { useMemo } from "react";

import { useValueRef } from "../utils/hooks";
import { useHelpConfig, useHelpData, useHelpState } from "./useHelpContext";

import type { HelpContentRenderProps, HelpItemData } from "../types";

//================================================

export interface HelpActiveContent extends Omit<HelpItemData, "content"> {
  /** Content to render inside the help popup */
  content: React.ReactNode;
  /** True if the help popup was opened as a tutorial, False if it was opened via the help overlay */
  isOpenedAsTutorial?: boolean;
  /** If currently viewing the intro sequence, this is the index of the current item in the sequence */
  introIndex?: number;
}

/** Gets the content (and relevant state) to display in the help popup for the currently active help item */
/** @param renderProps Props to pass to the content renderer (usually `callbacks` returned by `useHelpPopup`) */
export const useHelpActiveContent = (
  renderProps: HelpContentRenderProps
): HelpActiveContent | null => {
  const { activeItem } = useHelpState();
  const { items, introSequence } = useHelpData();
  const { notFoundKey } = useHelpConfig();

  const renderPropsRef = useValueRef(renderProps);

  return useMemo(() => {
    if (!activeItem) {
      return null;
    }

    // get the data for the active help item (or for the not-found item, if `notFoundKey` is set)
    const item = items[activeItem.key] || (notFoundKey ? items[notFoundKey] : undefined);
    const introIndex = item && introSequence ? introSequence.indexOf(item.key) : -1;

    if (!item) {
      return null;
    }
    return {
      ...item,
      isOpenedAsTutorial: activeItem.isOpenedAsTutorial,
      content:
        typeof item.content === "string" ? item.content : item.content(renderPropsRef.current),
      introIndex: introIndex > -1 ? introIndex : undefined,
    };
  }, [activeItem, introSequence, items, notFoundKey, renderPropsRef]);
};
