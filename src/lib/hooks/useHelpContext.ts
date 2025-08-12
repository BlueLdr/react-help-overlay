import { useContext } from "react";

import {
  HelpActionsContext,
  HelpConfigContext,
  HelpDataContext,
  HelpStateContext,
} from "../context";

//================================================

export const useHelpData = () => useContext(HelpDataContext);
export const useHelpState = () => useContext(HelpStateContext);
export const useHelpActions = () => useContext(HelpActionsContext);
export const useHelpConfig = () => useContext(HelpConfigContext);
