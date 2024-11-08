import { createStore } from 'vuex';

export interface UserInfo {
    id: string;
    username: string;
    email: string;
    provider: 'microsoft' | 'google';
}

export interface State {
    user: UserInfo | null;
    emissionsResults: any | null;
}

export default createStore<State>({
    state: {
        user: null,
        emissionsResults: null,
    },
    mutations: {
        setUser(state, user: UserInfo | null) {
            state.user = user;
        },
        setEmissionsResults(state, results: any) {
            state.emissionsResults = results;
        }
    },
    actions: {
    },
    getters: {
    },
});
