import type { HelpItemKey } from "./data";

//================================================

export interface MarkItemCompleteAction {
  (key: HelpItemKey): void;
}

export interface OpenHelpItemAction {
  (key: HelpItemKey, asTutorial?: boolean): void;
  // if key is null, the active help item will be cleared
  (key: null): void;
}

export interface SetTutorialsDisabledAction {
  (disabled: boolean): void;
}

export interface SetHelpOverlayActiveAction {
  (active: boolean): void;
}

export interface SetHelpElementScopeAction {
  /**
   * @param id Unique string for internal mapping
   * @param elementScopeRoot When an element is specified, only descendents of that element will be
   *                         highlighted/selectable in the Help overlay. (useful for modals, etc.)
   */
  (id: string, elementScopeRoot: HTMLElement | null): void;
}

export interface HelpActions {
  markItemComplete: MarkItemCompleteAction;
  openHelpItem: OpenHelpItemAction;
  setTutorialsDisabled: SetTutorialsDisabledAction;
  setHelpOverlayActive: SetHelpOverlayActiveAction;
  setHelpElementScope: SetHelpElementScopeAction;
}
