import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router';
import HomePage from '@/pages/HomePage.vue';
import NotFound from '@/pages/NotFound.vue';
import store from '@/store';

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
