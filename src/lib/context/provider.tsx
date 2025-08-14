import { useCallback, useEffect, useMemo, useState } from "react";

import { HelpStyles } from "../components/styles";
import { getElementZIndex } from "../utils";
import { useChangeEffect, useValueRef } from "../utils/hooks";
import { HelpActionsContext } from "./actions";
import { defaultHelpConfig, HelpConfigContext } from "./config";
import { HelpDataContext } from "./data";
import { HelpStateContext } from "./state";

import type {
  ActiveHelpItem,
  HelpActions,
  HelpConfig,
  HelpData,
  HelpScopeRoot,
  HelpState,
  HelpStoredState,
} from "../types";

//================================================

export type HelpProviderProps = {
  children: React.ReactNode;
  /** Data for all the help items in the application */
  data: HelpData;
  /** Initial stored state for the current user (loaded from database, localStorage, etc.) */
  initialState: HelpStoredState | null;
  /** Callback to store updated state (to database, localStorage, etc.) */
  onUpdateState: (newData: HelpStoredState) => void;
  /** Custom configuration options to use for the help system */
  config?: Partial<HelpConfig>;
};

/**
 * Main logic/state provider for the help system; should be placed at the root of the app with your
 * other context providers.
 */
export function HelpProvider({
  data,
  initialState,
  onUpdateState,
  config: customConfig,
  children,
}: HelpProviderProps) {
  const config = useMemo(() => ({ ...defaultHelpConfig, ...customConfig }), [customConfig]);

  const [activeItem, setActiveItem] = useState<ActiveHelpItem | null>(null);
  const [helpOverlayActive, setHelpOverlayActive] = useState<boolean>(false);
  const [elementScopeRoot, setElementScopeRoot] = useState<Map<string, HTMLElement>>(
    () => new Map()
  );
  const [tutorialsDisabled, setTutorialsDisabled] = useState(
    initialState?.tutorialsDisabled ?? false
  );
  const [tutorialCompletionState, setTutorialCompletionState] = useState(
    initialState?.tutorialCompletionState ?? {}
  );

  const completionStateRef = useValueRef(tutorialCompletionState);
  const overlayEnabledRef = useValueRef(helpOverlayActive);
  const dataRef = useValueRef(data);
  const elementScopeRootRef = useValueRef(elementScopeRoot);

  useEffect(() => {
    // Invoke update function whenever stored state changes
    onUpdateState(
      tutorialCompletionState === initialState?.tutorialCompletionState &&
        tutorialsDisabled === initialState?.tutorialsDisabled
        ? initialState
        : {
            tutorialsDisabled,
            tutorialCompletionState,
          }
    );
  }, [tutorialCompletionState, tutorialsDisabled, onUpdateState, initialState]);

  // Whenever external state changes, update internal state to match
  useChangeEffect(newValue => {
    setTutorialsDisabled(newValue?.tutorialsDisabled ?? false);
    setTutorialCompletionState(newValue?.tutorialCompletionState ?? {});
  }, initialState);

  const markItemComplete = useCallback<HelpActions["markItemComplete"]>(
    key => {
      if (!completionStateRef.current[key] && dataRef.current.items[key]?.isTutorial) {
        setTutorialCompletionState(prevState => ({ ...prevState, [key]: true }));
      }
    },
    [completionStateRef, dataRef]
  );

  const openHelpItem = useCallback<HelpActions["openHelpItem"]>(
    (key, asTutorial?: boolean) => {
      if (!key) {
        // if no key provided, clear the active item
        setActiveItem(null);
      } else if (overlayEnabledRef.current) {
        // if the overlay is open, set the active item without `isOpenedAsTutorial`
        setActiveItem({ key });
      } else {
        setActiveItem({ key, isOpenedAsTutorial: asTutorial });
      }
    },
    [overlayEnabledRef]
  );

  const setHelpElementScope = useCallback<HelpActions["setHelpElementScope"]>(
    (id, element) => {
      if (
        elementScopeRootRef.current.get(id) === element ||
        (!element && !elementScopeRootRef.current.has(id))
      ) {
        return;
      }
      setElementScopeRoot(map => {
        const newMap = new Map(map);
        if (!element) {
          newMap.delete(id);
        } else {
          newMap.set(id, element);
        }
        return newMap;
      });
    },
    [elementScopeRootRef]
  );

  const baseZIndex = config.baseZIndex;
  const scopeRoot = useMemo<HelpScopeRoot>(() => {
    // get id, element and zIndex for each scope root element in the stored map
    const values = Array.from(elementScopeRoot.entries()).map(([id, element]) => ({
      id,
      element,
      zIndex: getElementZIndex(element),
    }));
    return values.reduce(
      (max, item) => {
        // find the most-recently-opened item with the highest zIndex
        if (item.zIndex >= max.zIndex) {
          return item;
        }
        return max;
      },
      { element: null, zIndex: baseZIndex, id: "" } as HelpScopeRoot
    );
  }, [baseZIndex, elementScopeRoot]);

  const state = useMemo<HelpState>(
    () => ({
      tutorialCompletionState,
      tutorialsDisabled,
      activeItem,
      helpOverlayActive,
      scopeRoot,
    }),
    [tutorialCompletionState, tutorialsDisabled, activeItem, helpOverlayActive, scopeRoot]
  );

  const actions = useMemo<HelpActions>(
    () => ({
      markItemComplete,
      openHelpItem,
      setTutorialsDisabled: (value: boolean) => setTutorialsDisabled(value),
      setHelpOverlayActive: setHelpOverlayActive,
      setHelpElementScope,
    }),
    [markItemComplete, openHelpItem, setHelpElementScope]
  );

  return (
    <HelpConfigContext value={config}>
      <HelpDataContext value={data}>
        <HelpStateContext value={state}>
          <HelpActionsContext value={actions}>
            {!config.disableBuiltInStyles && <HelpStyles />}
            {children}
          </HelpActionsContext>
        </HelpStateContext>
      </HelpDataContext>
    </HelpConfigContext>
  );
}
