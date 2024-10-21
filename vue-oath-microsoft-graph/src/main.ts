import { createApp } from 'vue'
import App from './App.vue'
import store from './store'
import router from "@/router";
/* import the fontawesome core */
import { library } from '@fortawesome/fontawesome-svg-core'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import { faHouse, faUser, faCircleNotch, faComments } from '@fortawesome/free-solid-svg-icons'

// Color Palette
import './assets/css/base.css'
import {initializeMsalInstance} from "@/lib/microsoftGraph";

async function bootstrap() {
    library.add(faHouse, faUser, faCircleNotch, faComments);

    await initializeMsalInstance();

    createApp(App)
        .use(store)
        .use(router)
        .component('font-awesome-icon', FontAwesomeIcon) // Register the component here
        .mount('#app');
}

bootstrap();
