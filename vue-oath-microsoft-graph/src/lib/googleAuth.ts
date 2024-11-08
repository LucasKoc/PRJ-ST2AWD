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
    // Revoke token
    googleSdkLoaded((google) => {
        google.accounts.oauth2.revoke(<string>localStorage.getItem('google_access_token'), () => {
            localStorage.removeItem('google_access_token');
            console.log('Google token revoked');
        });
    });
    store.commit('setUser', null);
}
