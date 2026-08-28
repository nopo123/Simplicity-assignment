import { useEffect, useMemo, useRef } from "react";
import { DebouncedFunc } from "lodash";
import debounce from "lodash/debounce";
import { DEBOUNCE_MS } from "src/config/config";

export const useDebouncedCallback = <A extends unknown[]>(
  callback: (...args: A) => void,
  delayMs: number = DEBOUNCE_MS,
): DebouncedFunc<(...args: A) => void> => {
  const callbackRef = useRef(callback);

  const debounced = useMemo(
    () => debounce((...args: A) => callbackRef.current(...args), delayMs),
    [delayMs],
  );

  useEffect(() => {
    callbackRef.current = callback;
  }, [callback]);

  useEffect(() => () => debounced.cancel(), [debounced]);

  return debounced;
};
