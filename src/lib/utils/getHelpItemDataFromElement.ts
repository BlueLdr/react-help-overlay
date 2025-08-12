import { HELP_ITEM_IS_TUTORIAL_ATTRIBUTE, HELP_ITEM_KEY_ATTRIBUTE } from "./constants";

import type { HelpItemKey } from "../types";

//================================================

export const getHelpItemDataFromElement = (
  elem: HTMLElement,
): [HelpItemKey, boolean] | [undefined, undefined] => {
  let keyValue = elem.getAttribute(HELP_ITEM_KEY_ATTRIBUTE);
  let isTutorialValue = elem.getAttribute(HELP_ITEM_IS_TUTORIAL_ATTRIBUTE);

  // Click events for native `select` elements only happen when selecting an option
  if (!keyValue && !isTutorialValue && elem.tagName === "OPTION") {
    const parent = elem.parentElement;
    if (!parent) {
      return [undefined, undefined] as const;
    }
    keyValue = parent.getAttribute(HELP_ITEM_KEY_ATTRIBUTE);
    isTutorialValue = parent.getAttribute(HELP_ITEM_IS_TUTORIAL_ATTRIBUTE);
  }

  return [keyValue, isTutorialValue === "true"] as [HelpItemKey, boolean];
};
