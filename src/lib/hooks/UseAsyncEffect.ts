import { useEffect } from 'react';

// Used to trigger an asynchronous effect with a more convenient syntax.
// Provides a optional abortion status which is true if the using component gets unmounted while async effect is running
export const useAsyncEffect = (
    effectCallback: (_status?: { aborted: boolean }) => Promise<void | (() => void | undefined)> | (() => void),
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    dependencies?: any[],
): void => {
    useEffect(() => {
        const status = { aborted: false }; // fresh status object per effect invocation
        const cleanUpFunction = effectCallback(status);
        return () => {
            status.aborted = true;
            if (typeof cleanUpFunction === 'function') {
                cleanUpFunction();
            }
        };
    }, dependencies); // dynamic hook dependencies cannot be statically verified
};
