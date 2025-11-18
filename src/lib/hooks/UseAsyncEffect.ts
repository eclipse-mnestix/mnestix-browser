import { useEffect, useRef } from 'react';

// Used to trigger an asynchronous effect with a more convenient syntax.
// Provides a optional abortion status which is true if the using component gets unmounted while async effect is running
export function useAsyncEffect(
    effectCallback: (_status?: { aborted: boolean }) => Promise<void | (() => void | undefined)> | (() => void),
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    dependencies?: any[],
): void {
    const statusRef = useRef({ aborted: false });

    useEffect(() => {
        statusRef.current = { aborted: false };
        const cleanUpFunction = effectCallback(statusRef.current);
        return () => {
            statusRef.current.aborted = true;
            if (typeof cleanUpFunction === 'function') {
                cleanUpFunction();
            }
        };
    }, dependencies); // dynamic hook dependencies cannot be statically verified
}
