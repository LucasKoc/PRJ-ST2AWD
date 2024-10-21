import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router';
import HomePage from '@/pages/HomePage.vue';
import ConversationsIndexPage from '@/pages/ConversationsIndexPage.vue';
import ConversationShowPage from '@/pages/ConversationShowPage.vue';
import store from '@/store';

const routes: Array<RouteRecordRaw> = [
    {
        path: '/',
        name: 'Home',
        component: HomePage,
    },
    {
        path: '/conversations',
        name: 'ConversationsIndex',
        component: ConversationsIndexPage,
        meta: { requiresAuth: true },
    },
    {
        path: '/conversations/:id',
        name: 'ConversationShow',
        component: ConversationShowPage,
        meta: { requiresAuth: true },
    },
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

export default router;
