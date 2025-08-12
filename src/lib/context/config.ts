import { createContext } from "react";

import { HELP_BASE_Z_INDEX } from "../utils";

import type { HelpConfig } from "../types";

//================================================

export const defaultHelpConfig: HelpConfig = {
  helpButtonId: "help-button",
  helpRootContainerId: "help-overlay-root",
  baseZIndex: HELP_BASE_Z_INDEX,
};

export const HelpConfigContext = createContext<HelpConfig>(defaultHelpConfig);
