import { useMemo } from "react";

import {
  HELP_ITEM_BAD_KEY_ATTRIBUTE,
  HELP_ITEM_IS_TUTORIAL_ATTRIBUTE,
  HELP_ITEM_KEY_ATTRIBUTE,
  HELP_ITEM_STYLES_CLASS_NAME,
  joinClassNames,
} from "../utils";
import { useHelpConfig, useHelpData, useHelpState } from "./useHelpContext";
import { useHelpScopeZIndex } from "./useHelpScopeZIndex";

import type { HelpItemKey } from "../types";

//================================================

/** Gets the attributes of the given help item to pass to the related DOM element */
export const useHelpItemAttributes = <K extends HelpItemKey = HelpItemKey>(key: K) => {
  const { items } = useHelpData();
  const { tutorialsDisabled } = useHelpState();
  const { helpItemClassName, disableBuiltInStyles, zIndexOverrides } = useHelpConfig();

  const item = items[key];

  const style = useHelpScopeZIndex(zIndexOverrides.item);

  return useMemo(() => {
    const returnValue: Record<`data-${string}`, string> &
      Pick<React.HTMLProps<HTMLElement>, "style" | "className"> = {
      className: joinClassNames(
        !disableBuiltInStyles && HELP_ITEM_STYLES_CLASS_NAME,
        helpItemClassName
      ),
      style,
    };
    if (!item) {
      returnValue[HELP_ITEM_BAD_KEY_ATTRIBUTE] = key;
    } else {
      returnValue[HELP_ITEM_KEY_ATTRIBUTE] = key;
      if (item.isTutorial && !tutorialsDisabled) {
        returnValue[HELP_ITEM_IS_TUTORIAL_ATTRIBUTE] = "true";
      }
    }
    return returnValue;
  }, [disableBuiltInStyles, helpItemClassName, item, key, tutorialsDisabled, style]);
};
