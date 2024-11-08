import * as msal from '@azure/msal-browser'
import store from '@/store'

/**
 * List the requested scopes (aka. the requested permissions)
 */
const requestedScopes = {
    scopes: ["User.Read"]
}

interface UserInfo {
    id: string;
    username: string;
    email: string;
    provider: 'microsoft';
}

const msalInstance = new msal.PublicClientApplication({
    auth: {
        clientId: process.env.VUE_APP_MICROSOFT_OAUTH_CLIENT_ID ?? "",
    },
    cache: {
        cacheLocation: "sessionStorage"
    }
})

export async function initializeMsalInstance() {
    /**
     * Initialize the MSAL instance
     * If the user is already logged in, set the user in the store
     * If the user is not logged in, do nothing
     */
    try {
        await msalInstance.initialize();
        const account = msalInstance.getActiveAccount();
        if (account) {
            const user: UserInfo = {
                id: account.localAccountId,
                username: account.username,
                email: account.username,
                provider: 'microsoft',
            };
            store.commit('setUser', user);
        }
    } catch (error) {
        console.error('Error initializing MSAL instance:', error);
        throw error;
    }
}

export async function signInAndGetUser () {
    /**
     * Sign in the user and get the user's information
     */
    await initializeMsalInstance();

    const authResult = await msalInstance.loginPopup(requestedScopes)
    msalInstance.setActiveAccount(authResult.account)
    const user: UserInfo = {
        id: authResult.account.localAccountId,
        username: authResult.account.username,
        email: authResult.account.username,
        provider: 'microsoft',
    };
    store.commit('setUser', user);

    return authResult.account
}

export { msalInstance };
