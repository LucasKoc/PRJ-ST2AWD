import { createApp } from 'vue'
import App from './App.vue'
import store from './store'
import router from "@/router";
/* import the fontawesome core */
import { library } from '@fortawesome/fontawesome-svg-core'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import { faHouse, faUser, faCircleNotch, faComments } from '@fortawesome/free-solid-svg-icons'
import { faGoogle, faMicrosoft } from '@fortawesome/free-brands-svg-icons'

// Color Palette
import './assets/css/base.css'
import {initializeMsalInstance} from "@/lib/microsoftGraph";
import { initializeGoogleAuth } from '@/lib/googleAuth';
import vue3GoogleLogin from 'vue3-google-login'

const googleClientId = process.env.VUE_APP_GOOGLE_OAUTH_CLIENT_ID;

async function bootstrap() {
    library.add(faHouse, faUser, faCircleNotch, faComments, faGoogle, faMicrosoft);

    await initializeMsalInstance();
    await initializeGoogleAuth();

    const app = createApp(App);
    app.use(store)
        .use(router)
        .use(vue3GoogleLogin, googleClientId)
        .component('font-awesome-icon', FontAwesomeIcon)
        .mount('#app');
}

bootstrap();
