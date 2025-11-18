import router from '@/router/router';
import { defineStore } from 'pinia';

export const useAuthStore = defineStore('auth', {
    state: () => (<{
        token: string | undefined | null;
        username: string | undefined;
    }>{
            token: undefined,
            username: undefined,
        }),
    getters: {
        isAuthenticated(state) {
            if (!state.token) {
                state.token = localStorage.getItem('admin/authenticationToken');
            }
            return !!state.token;
        },
        authenticationHeader(state) {
            if (!state.token) {
                state.token = localStorage.getItem('admin/authenticationToken');
            }
            return state.token ? `Bearer ${state.token}` : undefined;
        }
    },
    actions: {
        setToken(newToken: string) {
            this.token = newToken;
            localStorage.setItem('admin/authenticationToken', newToken);
        },
        setUsername(u: string) {
            this.username = u;
        },
        clearAuth() {
            this.token = undefined;
            this.username = undefined;
            localStorage.removeItem('admin/authenticationToken');
        },
        handleUnauthorized() {
            this.clearAuth();
            router.push({ name: 'Login' });
        },
    },
});
