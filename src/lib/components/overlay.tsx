import { createPortal } from "react-dom";

import { useHelpConfig, useHelpState } from "../hooks";
import { useHelpOverlay } from "../hooks/useHelpOverlay";

//================================================

export type HelpOverlayRenderProps = Pick<React.ComponentProps<"div">, "className" | "style">;

export type HelpOverlayProps = React.ComponentProps<"div"> & {
  /**
   * Function to (conditionally) render the help overlay
   * @desc Traditionally, this would be an overlay/backdrop that dims the rest of the page.
   */
  renderOverlay: (
    /** True if the overlay should be rendered */
    isActive: boolean,
    /**
     * Style-related props to pass to the main HTML element of the overlay component.
     * Must be used in order to ensure that the correct zIndex is set on the overlay.
     */
    props?: HelpOverlayRenderProps
  ) => React.ReactNode;
};

/** Wrapper component that should be placed near the root of the application, but inside `<HelpProvider>` */
export function HelpOverlay({
  renderOverlay,
  children,
  className,
  style,
  ...props
}: HelpOverlayProps) {
  const { helpOverlayActive, scopeRoot } = useHelpState();
  const { helpRootContainerId } = useHelpConfig();
  const [attrs, styles] = useHelpOverlay({ className, style });

  let overlay = renderOverlay(helpOverlayActive, styles);
  if (scopeRoot.element) {
    overlay = createPortal(overlay, scopeRoot.element, scopeRoot.id);
  }

  return (
    <div {...props} {...attrs} id={helpRootContainerId}>
      {overlay}
      {children}
    </div>
  );
}
