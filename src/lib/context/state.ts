import { createContext } from "react";

import { HELP_BASE_Z_INDEX } from "../utils";

import type { HelpState } from "../types";

//================================================

export const HelpStateContext = createContext<HelpState>({
  tutorialCompletionState: {},
  activeItem: null,
  helpOverlayActive: false,
  scopeRoot: {
    id: "",
    element: null,
    zIndex: HELP_BASE_Z_INDEX,
  },
});
