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
  didChange: (oldValue: T, newValue: T) => boolean;
  triggerOnMount?: boolean;
}

export const useChangeEffect = <T>(
  callback: (newValue: T) => void | (() => void),
  value: T,
  options?: UseChangeEffectOptions<T>,
) => {
  const { triggerOnMount, didChange = defaultDidChange } = options ?? {};
  const prevValue = useRef(value);
  const hasMounted = useRef(false);
  const callbackRef = useValueRef(callback);

  useEffect(() => {
    const hasAlreadyMounted = hasMounted.current;
    hasMounted.current = true;
    if (
      (!hasAlreadyMounted && triggerOnMount) ||
      didChange(prevValue.current, value)
    ) {
      return callbackRef.current(value);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value, didChange, callbackRef]);
};
