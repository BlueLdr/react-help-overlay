import { useHelpConfig, useHelpData, useHelpState } from "./useHelpContext";

import type { HelpContentRenderProps, HelpItemData } from "../types";

//================================================

export interface HelpActiveContent extends Omit<HelpItemData, "content"> {
  content: React.ReactNode;
  isOpenedAsTutorial?: boolean;
  introIndex?: number;
}

export const useHelpActiveContent = (
  renderProps: HelpContentRenderProps,
): HelpActiveContent | null => {
  const { activeItem } = useHelpState();
  const { items, introSequence } = useHelpData();
  const { notFoundKey } = useHelpConfig();

  if (!activeItem) {
    return null;
  }

  const item = items[activeItem.key] || (notFoundKey ? items[notFoundKey] : undefined);

  if (!item) {
    return null;
  }

  const introIndex = introSequence?.indexOf(item.key) ?? -1;

  return {
    ...item,
    isOpenedAsTutorial: activeItem.isOpenedAsTutorial,
    content: typeof item.content === "string" ? item.content : item.content(renderProps),
    introIndex: introIndex > -1 ? introIndex : undefined,
  };
};
