import { createContext } from "react";

import type { HelpData } from "../types";

//================================================

export const HelpDataContext = createContext<HelpData>({
  items: {},
});
