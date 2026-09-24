import { useCallback, useEffect, useRef, useState } from 'react';

/**
 * Runs an async service call and tracks loading / error / data.
 * Re-runs whenever `deps` change; `reload()` re-runs on demand.
 */
export default function useAsync(asyncFn, deps = []) {
  const [state, setState] = useState({ data: null, loading: true, error: null });
  const requestId = useRef(0);

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const run = useCallback(asyncFn, deps);

  const load = useCallback(async () => {
    const id = ++requestId.current;
    setState((current) => ({ ...current, loading: true, error: null }));
    try {
      const data = await run();
      if (id === requestId.current) setState({ data, loading: false, error: null });
    } catch (error) {
      if (id === requestId.current) setState({ data: null, loading: false, error });
    }
  }, [run]);

  useEffect(() => {
    load();
  }, [load]);

  const setData = useCallback((updater) => {
    setState((current) => ({ ...current, data: typeof updater === 'function' ? updater(current.data) : updater }));
  }, []);

  return { ...state, reload: load, setData };
}
