import { useEffect, useRef } from "react";

//================================================

export const useValueRef = <T>(value: T) => {
  const valueRef = useRef<T>(value);
  valueRef.current = value;
  return valueRef;
};

//================================================

const defaultDidChange = <T>(oldValue: T, newValue: T) => oldValue !== newValue;

export interface UseChangeEffectOptions<T> {
  /** Custom function to determine equality of new/old values */
  didChange?: (oldValue: T, newValue: T) => boolean;
  /** If true, the effect callback will be invoked when the component mounts */
  triggerOnMount?: boolean;
}

/**
 * useEffect that only triggers when the given value changes (and optionally on mount)
 * @param callback The callback to invoke when the effect is triggered
 * @param value The value to monitor for changes
 * @param options Additional options to customize behavior
 */
export const useChangeEffect = <T>(
  callback: (newValue: T) => void | (() => void),
  value: T,
  options?: UseChangeEffectOptions<T>
) => {
  const { triggerOnMount, didChange = defaultDidChange } = options ?? {};
  const prevValue = useRef(value);
  const hasMounted = useRef(false);
  const callbackRef = useValueRef(callback);

  useEffect(() => {
    const hasAlreadyMounted = hasMounted.current;
    hasMounted.current = true;
    // if the value has changed, or the component is mounting and the triggerOnMount flag is set
    if ((!hasAlreadyMounted && triggerOnMount) || didChange(prevValue.current, value)) {
      // invoke the callback
      return callbackRef.current(value);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value, didChange, callbackRef]);
};
