import { useCallback, useEffect, useMemo } from "react";

import {
  HELP_OVERLAY_ENABLED_ATTRIBUTE,
  getHelpItemDataFromElement,
  HELP_OVERLAY_Z_INDEX_OFFSET,
  joinClassNames,
  HELP_OVERLAY_STYLES_CLASS_NAME,
  HELP_ACTIVE_SCOPE_ROOT_ATTRIBUTE,
} from "../utils";
import { useValueRef } from "../utils/hooks";
import { useHelpActions, useHelpConfig, useHelpState } from "./useHelpContext";
import { useHelpScopeZIndex } from "./useHelpScopeZIndex";

import type { HelpOverlayRenderProps } from "../components";

//================================================

const captureOptions: EventListenerOptions = { capture: true };
const silenceEvent = (e: Event) => {
  e.preventDefault();
  e.stopPropagation();
};

/**
 * Returns attributes to pass to the root wrapper, and styles (both required and optional) for the help overlay,
 * Also handles enabling/disabling click listeners for help items when the overlay is toggled
 */
export const useHelpOverlay = (
  customStyles?: HelpOverlayRenderProps
): [rootAttrs: Record<string, string>, overlayStyles: HelpOverlayRenderProps] => {
  const { helpOverlayActive, activeItem, scopeRoot } = useHelpState();
  const { setHelpOverlayActive, openHelpItem } = useHelpActions();
  const { disableBuiltInStyles, helpOverlayClassName } = useHelpConfig();

  const activeItemRef = useValueRef(activeItem);
  const overlayEnabledRef = useValueRef(helpOverlayActive);

  // "Escape" key listener to close overlay when it's active
  useEffect(() => {
    // don't set listeners if the overlay is not active
    if (!helpOverlayActive) {
      return;
    }

    const listener = (e: KeyboardEvent) => {
      // close overlay when Escape is pressed
      if (e.key === "Escape") {
        e.preventDefault();
        e.stopPropagation();
        setHelpOverlayActive(false);
      }
    };

    window.addEventListener("keydown", listener);
    return () => {
      window.removeEventListener("keydown", listener);
    };
  }, [helpOverlayActive, setHelpOverlayActive]);

  /** Handler for clicking on an item when "Help" mode is active */
  const onClickItem = useCallback<EventListener>(
    event => {
      // if another help item is active, abort
      if (
        activeItemRef.current ||
        !overlayEnabledRef.current ||
        !(event.target instanceof HTMLElement)
      ) {
        return;
      }

      // get the help metadata for the clicked element
      const [key] = getHelpItemDataFromElement(event.target);
      if (!key) {
        return;
      }

      // Open the help modal and disable the overlay
      openHelpItem(key);
      setHelpOverlayActive(false);
    },
    [activeItemRef, overlayEnabledRef, openHelpItem, setHelpOverlayActive]
  );

  useEffect(() => {
    // don't set listeners if the overlay is not active
    if (!helpOverlayActive) {
      return;
    }

    window.addEventListener("mousedown", silenceEvent, captureOptions);
    window.addEventListener("mouseup", silenceEvent, captureOptions);
    window.addEventListener("click", onClickItem, captureOptions);

    return () => {
      window.removeEventListener("mousedown", silenceEvent, captureOptions);
      window.removeEventListener("mouseup", silenceEvent, captureOptions);
      window.removeEventListener("click", onClickItem, captureOptions);
    };
  }, [helpOverlayActive, onClickItem]);

  const style = useHelpScopeZIndex(HELP_OVERLAY_Z_INDEX_OFFSET);

  return useMemo(() => {
    const attrs: Record<string, string> = {};
    if (helpOverlayActive) {
      attrs[HELP_OVERLAY_ENABLED_ATTRIBUTE] = "true";
    }
    // if no scope root element is set, then the root wrapper is the scope root element
    if (!scopeRoot.element) {
      attrs[HELP_ACTIVE_SCOPE_ROOT_ATTRIBUTE] = "true";
    }

    return [
      attrs,
      {
        style: { ...customStyles?.style, ...style },
        className: joinClassNames(
          !disableBuiltInStyles && HELP_OVERLAY_STYLES_CLASS_NAME,
          helpOverlayClassName,
          customStyles?.className
        ),
      } satisfies HelpOverlayRenderProps,
    ];
  }, [
    customStyles?.className,
    customStyles?.style,
    disableBuiltInStyles,
    helpOverlayActive,
    helpOverlayClassName,
    scopeRoot.element,
    style,
  ]);
};
