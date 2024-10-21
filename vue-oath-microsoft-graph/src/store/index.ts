import { createStore } from 'vuex';
import { AccountInfo } from '@azure/msal-browser';

export interface State {
    user: AccountInfo | null;
}

export default createStore<State>({
    state: {
        user: null,
    },
    mutations: {
        setUser(state, user: AccountInfo | null) {
            state.user = user;
        },
    },
    actions: {
    },
    getters: {
    },
});
