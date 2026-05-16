import { createRouter, createWebHashHistory } from 'vue-router'
import CuentaView from '@/account/interfaces/presentation/profile.page.vue'
import FoodHeavenView from '@/shared/interfaces/presentation/authenticated-shell.page.vue'
import CalendarioView from '@/meal-plans/interfaces/presentation/calendario-view.page.vue'
import LoginView from '@/security/interfaces/presentation/login/login-view.page.vue'
import InicioView from '@/food-catalog/interfaces/presentation/Inicio.page.vue'
import RegisterView from '@/security/interfaces/presentation/register/register-view.page.vue'

const routes = [
    {
        path: '/',
        redirect: '/login'
    },
    {
        path: '/login',
        name: 'Login',
        component: LoginView,
    },
    {
        path: '/register',
        name: 'Register',
        component: RegisterView,
    },
    {
        path: '/foodheaven',
        name: 'FoodHeaven',
        component: FoodHeavenView,
        children: [
            {
                path: 'inicio',
                name: 'Inicio',
                component: InicioView,
            },
            {
                path: 'calendario',
                name: 'Calendario',
                component: CalendarioView,
            },
            {
                path: 'cuenta',
                name: 'Cuenta',
                component: CuentaView,
            }
        ]
    }
]

const router = createRouter({
    history: createWebHashHistory(),
    routes
})

export default router
