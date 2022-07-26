import VueRouter from "vue-router";
import Vue from "vue";

Vue.use(VueRouter);
export const router = new VueRouter({
    routes: [
        {
            path: '/login',
            name: 'login',
            component: () => import('../page/LoginPage')
        },
        {
            path: '/',
            name: 'signup',
            component: () => import('../page/SignUp')
        },
        {
            path: '/chat',
            name: 'chat',
            component: () => import('../page/Chat')
        }

    ],
    mode: "history"
})