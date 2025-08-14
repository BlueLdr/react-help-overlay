import type { HelpItemKey } from "./data";

//================================================

export interface HelpConfig {
  /** The zIndex that should be used for the help overlay/modal/button when no scope element is set */
  baseZIndex: number;

  /** HTML id to assign to the button that activates the help overlay */
  helpButtonId: string;

  /** ClassName to assign to the global help button; returned as part of the button attrs from `useHelpButton` */
  helpButtonClassName?: string;

  /** ClassName to assign to each help item; returned as part of the help item attrs from `useHelpItemAttributes` */
  helpItemClassName?: string;

  /** ClassName to assign to each help item; returned as part of the overlay component attrs from `useHelpOverlay` */
  helpOverlayClassName?: string;

  /** HTML id to assign to the root container of the help overlay */
  helpRootContainerId: string;

  /** Item to show if the active key has no entry in the HelpData */
  notFoundKey?: HelpItemKey;

  /** Disables all optional built-in styles for the help overlay/items. This includes:
   * - Border on hover
   * - Box shadow
   * - Cursor
   * - Pointer events
   */
  disableBuiltInStyles?: boolean;

  /** For debugging */
  highlightElementsWithBadKeys?: boolean;
}
