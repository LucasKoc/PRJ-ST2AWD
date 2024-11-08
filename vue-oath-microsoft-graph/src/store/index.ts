import { createStore } from 'vuex';

export interface UserInfo {
    id: string;
    username: string;
    email: string;
    provider: 'microsoft' | 'google';
}

export interface State {
    user: UserInfo | null;
}

export default createStore<State>({
    state: {
        user: null,
    },
    mutations: {
        setUser(state, user: UserInfo | null) {
            state.user = user;
        },
    },
    actions: {
    },
    getters: {
    },
});
