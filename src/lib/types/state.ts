import type { HelpItemKey } from "./data";

//================================================

export type TutorialCompletionState = {
  [K in HelpItemKey]?: boolean;
};

/** State that must be stored per user across sessions */
export interface HelpStoredState {
  tutorialsDisabled?: boolean;
  /** Dictionary indicating which tutorial items have already been viewed/completed */
  tutorialCompletionState: TutorialCompletionState;
}

export interface ActiveHelpItem {
  key: HelpItemKey;
  /**
   * True if the active help item was opened as a tutorial; Useful for knowing whether to show a
   * "Don't show me popup tutorials" option in the help popup.
   */
  isOpenedAsTutorial?: boolean;
}

export interface HelpScopeRoot {
  /** If `element` is null, then the root wrapper (the `<HelpOverlay>` component) is the scope root */
  element: HTMLElement | null;
  id: string;
  zIndex: number;
}

export interface HelpState extends HelpStoredState {
  activeItem: ActiveHelpItem | null;
  helpOverlayActive: boolean;
  /**
   * Only descendents of the scope root element will be highlighted/selectable in the Help overlay.
   * E.g. When you open a modal, then open the help overlay, you only want the help overlay to
   * highlight elements inside that modal, and ignore other help items on the page. Setting the modal
   * as the scope root will trigger that behavior.
   */
  scopeRoot: HelpScopeRoot;
}
