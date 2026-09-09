/**
 * Browser-side logout helper. Lives in its own module on purpose: it used to sit in `infrastructure.ts`
 * alongside the `mnestixFetch` wrappers, which made `UseAuth` — and therefore every Client Component using it —
 * import the server-fetch module. While that module carried a `'use server'` directive, this import edge
 * published its unvalidated, arbitrary-URL fetch primitives to the browser as callable Server Actions.
 * Keep browser-side helpers out of modules that reach `serverFetch`.
 */
export const sessionLogOut = async (keycloakEnabled: boolean) => {
    if (!keycloakEnabled) return;
    try {
        await fetch('/api/auth/logout', { method: 'GET' });
    } catch (err) {
        console.error(err);
    }
};
