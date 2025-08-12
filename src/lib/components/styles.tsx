import { useInsertionEffect } from "react";

import { useHelpConfig } from "../hooks";
import {
  HELP_ACTIVE_SCOPE_ROOT_ATTRIBUTE,
  HELP_BUTTON_STYLES_CLASS_NAME,
  HELP_ITEM_STYLES_CLASS_NAME,
  HELP_OVERLAY_ENABLED_ATTRIBUTE,
  HELP_OVERLAY_STYLES_CLASS_NAME,
  HELP_STYLES_PSEUDO_ELEMENT_CSS_VAR_NAME,
} from "../utils";

import type { HelpConfig } from "../types";

//================================================

const css = String.raw;

type StyleParams = Required<
  Pick<
    HelpConfig,
    | "helpButtonClassName"
    | "helpButtonId"
    | "helpItemClassName"
    | "helpOverlayClassName"
    | "helpRootContainerId"
    | "highlightElementsWithBadKeys"
  >
>;

const makeStyles = ({ helpRootContainerId, helpItemClassName }: StyleParams) => css`
  #${helpRootContainerId}[${HELP_OVERLAY_ENABLED_ATTRIBUTE}="true"] {
    position: relative;
  }

  #${helpRootContainerId}[${HELP_OVERLAY_ENABLED_ATTRIBUTE}="true"] {
    &[${HELP_ACTIVE_SCOPE_ROOT_ATTRIBUTE}="true"],
    & [${HELP_ACTIVE_SCOPE_ROOT_ATTRIBUTE}="true"] {
      & .${helpItemClassName} {
        box-shadow: 0 0 5px rgba(48, 48, 48, 0.6);
        cursor: help !important;
        position: relative;
        opacity: 1;
        pointer-events: none;

        &::after {
          content: " ";
          border: 2px solid rgba(90, 178, 255, 0);
          border-radius: 4px;
          width: 100%;
          height: 100%;
          position: absolute;
          top: 0;
          left: 0;
          z-index: var(${HELP_STYLES_PSEUDO_ELEMENT_CSS_VAR_NAME});
          cursor: help !important;
          pointer-events: auto !important;
          transition: border-color 80ms;
        }

        &:hover::after {
          border-color: rgba(90, 178, 255, 1);
        }
      }
    }
  }
`;

//================================================

const stylesInserted = new Set();

export function HelpStyles() {
  const {
    helpRootContainerId,
    helpButtonId,
    helpButtonClassName,
    helpItemClassName,
    helpOverlayClassName,
    highlightElementsWithBadKeys,
  } = useHelpConfig();

  useInsertionEffect(() => {
    const params: StyleParams = {
      helpRootContainerId,
      helpButtonId,
      helpButtonClassName: helpButtonClassName || HELP_BUTTON_STYLES_CLASS_NAME,
      helpItemClassName: helpItemClassName || HELP_ITEM_STYLES_CLASS_NAME,
      helpOverlayClassName: helpOverlayClassName || HELP_OVERLAY_STYLES_CLASS_NAME,
      highlightElementsWithBadKeys: !!highlightElementsWithBadKeys,
    };

    const styles = makeStyles(params);
    if (stylesInserted.has(styles)) {
      return;
    }

    const element = document.createElement("style");
    element.innerHTML = styles;
    document.head.appendChild(element);

    return () => {
      document.head.removeChild(element);
      stylesInserted.delete(styles);
    };
  }, [
    helpRootContainerId,
    helpButtonId,
    helpButtonClassName,
    helpItemClassName,
    helpOverlayClassName,
    highlightElementsWithBadKeys,
  ]);

  return null;
}
