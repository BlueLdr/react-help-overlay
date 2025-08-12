import type { HelpItemKey } from "./data";

//================================================

export type TutorialCompletionState = {
  [K in HelpItemKey]?: boolean;
};

export interface HelpStoredState {
  tutorialsDisabled?: boolean;
  tutorialCompletionState: TutorialCompletionState;
}

export interface ActiveHelpItem {
  key: HelpItemKey;
  isOpenedAsTutorial?: boolean;
}

export interface HelpScopeRoot {
  element: HTMLElement | null;
  id: string;
  zIndex: number;
}

export interface HelpState extends HelpStoredState {
  activeItem: ActiveHelpItem | null;
  helpOverlayActive: boolean;
  scopeRoot: HelpScopeRoot;
}
