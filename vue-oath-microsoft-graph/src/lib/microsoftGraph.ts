import * as msal from '@azure/msal-browser'
import store from '@/store'

/**
 * List the requested scopes (aka. the requested permissions)
 */
const requestedScopes = {
    scopes: ["User.Read"]
}

const msalInstance = new msal.PublicClientApplication({
    auth: {
        clientId: process.env.VUE_APP_OAUTH_CLIENT_ID
    },
    cache: {
        cacheLocation: "sessionStorage"
    }
})

export async function initializeMsalInstance() {
    try {
        await msalInstance.initialize();
        const account = msalInstance.getActiveAccount();
        if (account) store.commit('setUser', account);
    } catch (error) {
        console.error('Error initializing MSAL instance:', error);
        throw error;
    }
}

export async function signInAndGetUser () {
    await initializeMsalInstance();

    const authResult = await msalInstance.loginPopup(requestedScopes)
    msalInstance.setActiveAccount(authResult.account)
    store.commit('setUser', authResult.account);
    return authResult.account
}
