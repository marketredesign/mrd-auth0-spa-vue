import { getInstance } from "./index";

/**
 * Verifies the user is authenticated and redirects to login page if not. Exports Vue router guard.
 *
 * @param to Target route object being navigated to.
 * @param from Current route being navigated away from.
 * @param next Function to resolve the hook. See https://router.vuejs.org/guide/advanced/navigation-guards.html
 */
export const authGuard = (to, from, next) => {
    const authService = getInstance();

    const fn = () => {
        // If the user is authenticated, continue with the route
        if (authService.state.isAuthenticated) {
            return next();
        }

        // Otherwise, log in
        authService.loginWithRedirect({ appState: { targetUrl: to.fullPath } });
    };

    // If loading has already finished, check our auth state using `fn()`
    if (!authService.state.loading) {
        return fn();
    }

    // Watch for the loading property to change before we check isAuthenticated
    authService.storeVM.$watch("loading", loading => {
        if (loading === false) {
            return fn();
        }
    });
};

/**
 * Verifies the user is authenticated and has the provided permission. If the user is not authenticated, they will
 * be redirected to the login page. If the user doesn't have the provided permission, the route change is not permitted.
 * @param permission
 * @return Exports function that returns a Vue router guard.
 */
export const permissionGuard = (permission) => {
    return (to, from, next) => {
        const authService = getInstance();

        const fn = async () => {
            // If the user is not authenticated, redirect them to login.
            if (!authService.state.isAuthenticated) {
                authService.loginWithRedirect({ appState: { targetUrl: to.fullPath } });
                return;
            }

            // Get all claims in the JWT.
            const claims = await authService.getIdTokenClaims();

            if (!claims['https://marketredesign.com/permissions'].includes(permission)) {
                // Permission is not included in JWT, so don't allow the route change.
                return next(false);
            }

            // User is authenticated and has the required permission. Allow route change.
            return next();
        };

        // If loading has already finished, check our auth state using `fn()`
        if (!authService.state.loading) {
            return fn();
        }

        // Watch for the loading property to change before we check isAuthenticated
        authService.storeVM.$watch("loading", loading => {
            if (loading === false) {
                return fn();
            }
        });
    };
};
