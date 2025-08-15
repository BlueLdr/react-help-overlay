import { createContext } from "react";

import {
  HELP_BASE_Z_INDEX,
  HELP_BUTTON_Z_INDEX_OFFSET,
  HELP_ITEM_Z_INDEX_OFFSET,
  HELP_OVERLAY_Z_INDEX_OFFSET,
  HELP_POPUP_Z_INDEX_OFFSET,
} from "../utils";

import type { HelpConfig } from "../types";

//================================================

export const defaultHelpConfig: HelpConfig = {
  helpButtonId: "help-button",
  helpRootContainerId: "help-overlay-root",
  zIndexOverrides: {
    base: HELP_BASE_Z_INDEX,
    overlay: HELP_OVERLAY_Z_INDEX_OFFSET,
    button: HELP_BUTTON_Z_INDEX_OFFSET,
    item: HELP_ITEM_Z_INDEX_OFFSET,
    popup: HELP_POPUP_Z_INDEX_OFFSET,
  },
};

export const HelpConfigContext = createContext<HelpConfig>(defaultHelpConfig);
