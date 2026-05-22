import { createRouter, createWebHashHistory } from 'vue-router'
import CuentaView from '@/account/interfaces/presentation/profile.page.vue'
import FoodHeavenView from '@/shared/interfaces/presentation/authenticated-shell.page.vue'
import CalendarioView from '@/meal-plans/interfaces/presentation/calendario-view.page.vue'
import LoginView from '@/security/interfaces/presentation/login/login-view.page.vue'
import InicioView from '@/food-catalog/interfaces/presentation/Inicio.page.vue'
import RegisterView from '@/security/interfaces/presentation/register/register-view.page.vue'
import ForgotPasswordView from '@/security/interfaces/presentation/forgot-password/forgot-password-view.page.vue'
import SettingsView from '@/settings/interfaces/presentation/settings.page.vue'
import { hasActiveSession } from '@/security/application/internal/auth-api.service.js'

const routes = [
    {
        path: '/',
        redirect: '/login'
    },
    {
        path: '/login',
        name: 'Login',
        component: LoginView,
        meta: { guestOnly: true }
    },
    {
        path: '/register',
        name: 'Register',
        component: RegisterView,
        meta: { guestOnly: true }
    },
    {
        path: '/forgot-password',
        name: 'ForgotPassword',
        component: ForgotPasswordView,
        meta: { guestOnly: true }
    },
    {
        path: '/foodheaven',
        name: 'FoodHeaven',
        component: FoodHeavenView,
        meta: { requiresAuth: true },
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
            },
            {
                path: 'configuracion',
                name: 'Configuracion',
                component: SettingsView,
            }
        ]
    }
]

const router = createRouter({
    history: createWebHashHistory(),
    routes
})

router.beforeEach((to) => {
    const isAuthenticated = hasActiveSession()

    if (to.matched.some(record => record.meta.requiresAuth) && !isAuthenticated) {
        return { name: 'Login' }
    }

    if (to.meta.guestOnly && isAuthenticated) {
        return { name: 'Inicio' }
    }
})

export default router
