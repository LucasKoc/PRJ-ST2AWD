import { createApp } from "vue"
import App from "./App.vue"
import store from "./store"
import router from "@/router";
/* import the fontawesome core */
import { library } from "@fortawesome/fontawesome-svg-core"
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome"
import {
    faHouse,
    faUser,
    faCircleNotch,
    faComments,
    faEarthAmericas,
    faCloud,
    faLeaf,
    faCalculator
} from "@fortawesome/free-solid-svg-icons"
import { faGoogle, faMicrosoft } from "@fortawesome/free-brands-svg-icons"

// Color Palette
import "./assets/css/base.css"
import {initializeMsalInstance} from "@/lib/microsoftGraph";
import { initializeGoogleAuth } from "@/lib/googleAuth";
import vue3GoogleLogin from "vue3-google-login"

const googleClientId = process.env.VUE_APP_GOOGLE_OAUTH_CLIENT_ID;

function defineColorScheme() {
    /**
     * Set the color scheme based on the user's browser preference
     * If the user's browser preference is dark, set the theme to dark
     * If the user's browser preference is light, set the theme to light
     */
    const prefScheme = window.matchMedia("(prefers-color-scheme: dark)").matches ? "night" : "nord";
    document.documentElement.setAttribute("data-theme", prefScheme);

    window.matchMedia("(prefers-color-scheme: dark)").addEventListener("change", e => {
        document.documentElement.setAttribute('data-theme', e.matches ? "night" : "nord");
    });
}

async function bootstrap() {
    /**
     * This function initializes the app
     * It adds the fontawesome icons to the library
     * It initializes the MSAL and Google Auth instances
     * It sets the color scheme based on the user's browser preference
     * It creates the app and mounts it to the DOM
     * @returns {Promise<void>}
     */
    library.add(faHouse, faUser, faCircleNotch, faComments, faGoogle, faMicrosoft, faEarthAmericas, faCloud, faLeaf, faCalculator);

    await initializeMsalInstance();
    await initializeGoogleAuth();

    defineColorScheme();

    const app = createApp(App);
    app.use(store)
        .use(router)
        .use(vue3GoogleLogin, googleClientId)
        .component('font-awesome-icon', FontAwesomeIcon)
        .mount('#app');
}

bootstrap();
