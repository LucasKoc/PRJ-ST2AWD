import { googleSdkLoaded } from 'vue3-google-login';
import store from '@/store';

interface UserInfo {
    id: string;
    username: string;
    email: string;
    provider: 'google';
}

let tokenClient: any;
let googleAuthInitialized = false;

const CLIENT_ID = process.env.VUE_APP_GOOGLE_OAUTH_CLIENT_ID ?? "";

export function initializeGoogleAuth() {
    /**
     * Initialize Google Auth
     * This function is called when the user clicks the "Sign in with Google" button.
     * It initializes the Google Auth SDK and sets up the token client.
     */
    if (googleAuthInitialized) return;
    googleSdkLoaded((google) => {
        tokenClient = google.accounts.oauth2.initTokenClient({
            client_id: CLIENT_ID,
            scope: 'profile email openid',
            callback: (response: any) => {
                if (response.error) {
                    console.error('Error during Google sign-in:', response.error);
                    return;
                }
                fetchUserInfo(response.access_token);
            },
        });
        googleAuthInitialized = true;
    });
    const accessToken = localStorage.getItem('google_access_token');
    if (accessToken) {
        fetchUserInfo(accessToken);
    }
}

function fetchUserInfo(accessToken: string) {
    /**
     * Fetch user info
     * This function is called when the user signs in with Google.
     * It fetches the user's info from the Google API and stores it in the Vuex store.
     */
    localStorage.setItem('google_access_token', accessToken);

    fetch('https://www.googleapis.com/oauth2/v3/userinfo', {
        headers: {
            Authorization: `Bearer ${accessToken}`,
        },
    })
        .then((response) => response.json())
        .then((userInfo) => {
            const user: UserInfo = {
                id: userInfo.sub,
                username: userInfo.name,
                email: userInfo.email,
                provider: 'google',
            };
            store.commit('setUser', user);
        })
        .catch((error) => {
            console.error('Error fetching user info:', error);
        });
}

export function signInWithGoogle() {
    if (!googleAuthInitialized) {
        initializeGoogleAuth();
    }
    tokenClient.requestAccessToken();
}

export function signOutFromGoogle() {
    /**
     * Sign out from Google
     * This function is called when the user clicks the "Sign out" button.
     * It revokes the user's Google access token and clears the user info from the Vuex store.
     */
    googleSdkLoaded((google) => {
        google.accounts.oauth2.revoke(<string>localStorage.getItem('google_access_token'), () => {
            localStorage.removeItem('google_access_token');
            console.log('Google token revoked');
        });
    });
    store.commit('setUser', null);
}
