import { useHelpConfig, useHelpState } from "../hooks";
import { useHelpOverlay } from "../hooks/useHelpOverlay";

//================================================

export type HelpOverlayRenderProps = Pick<React.ComponentProps<"div">, "className" | "style">;

export type HelpOverlayProps = React.ComponentProps<"div"> & {
  renderOverlay: (isActive: boolean, props?: HelpOverlayRenderProps) => React.ReactNode;
};

export function HelpOverlay({
  renderOverlay,
  children,
  className,
  style,
  ...props
}: HelpOverlayProps) {
  const { helpOverlayActive } = useHelpState();
  const { helpRootContainerId } = useHelpConfig();
  const [attrs, styles] = useHelpOverlay({ className, style });

  return (
    <div {...props} {...attrs} id={helpRootContainerId}>
      {renderOverlay(helpOverlayActive, styles)}
      {children}
    </div>
  );
}
