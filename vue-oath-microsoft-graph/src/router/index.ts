import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router';
import HomePage from '@/pages/HomePage.vue';
import NotFound from '@/pages/NotFound.vue';
import store from '@/store';
import CloudComputingForm from "@/pages/CloudComputingForm.vue";
import FlightActivityForm from "@/pages/FlightActivityForm.vue";
import CustomActivity from "@/pages/CustomActivityForm.vue";
import EmissionsChart from "@/pages/EmissionsChart.vue";

const routes: Array<RouteRecordRaw> = [
    {
        path: '/',
        name: 'Home',
        component: HomePage,
        meta: {
            title: 'Home',
        },
    },
    {
      path: '/panel',
        name: 'Panel',
        component: HomePage,
        meta: {
            requiresAuth: true,
            title: 'Panel',
        },
    },
    {
        path: '/cloud-computing/',
        name: 'Cloud Computing Form',
        component: CloudComputingForm,
        meta: {
            requiresAuth: true,
            title: 'Cloud Computing Form',
        },
    },
    {
      path: '/flight-activity/',
        name: 'Flight Activity',
        component: FlightActivityForm,
        meta: {
            requiresAuth: true,
            title: 'Flight Activity',
        },
    },
    {
      path: '/custom-activity/',
        name: 'Custom Activity',
        component: CustomActivity,
        meta: {
            requiresAuth: true,
            title: 'Custom Activity',
        },
    },
    {
        path: '/emission-chart/',
        name: 'Emission-chart',
        component: EmissionsChart,
        meta: {
            requiresAuth: true,
            title: 'Emission Chart',
        },
    },
    {
        // Create a new route for 404 page
        path: '/:pathMatch(.*)*',
        name: '404 - Page not found',
        component: NotFound,
        meta: {
            title: '404 - Page not found',
        },
    }

];

const router = createRouter({
    history: createWebHistory(process.env.BASE_URL),
    routes,
});

router.beforeEach((to, from, next) => {
    const requiresAuth = to.matched.some(record => record.meta.requiresAuth);
    const isAuthenticated = store.state.user !== null;

    if (requiresAuth && !isAuthenticated) {
        next('/');
    } else {
        next();
    }
});

router.beforeEach((to, from, next) => {
    document.title = `${to.meta?.title ?? to.name} | PRJ-ST2AWD`;
    next();
});

export default router;
