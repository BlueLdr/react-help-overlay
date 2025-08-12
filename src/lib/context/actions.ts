import { createContext } from "react";

import type { HelpActions } from "../types/actions";

//================================================

export const HelpActionsContext = createContext<HelpActions>({
  markItemComplete: () => undefined,
  openHelpItem: () => undefined,
  setTutorialsDisabled: () => undefined,
  setHelpOverlayActive: () => undefined,
  setHelpElementScope: () => undefined,
});
