import { createRouter, createWebHashHistory } from 'vue-router'
import HomeView from '@/shared/presentation/home-view.page.vue'
import CuentaView from '@/comida/presentation/cuenta/presentation/PerfilComponent.vue'
import FoodHeavenView from '@/comida/presentation/foodheaven-view.page.vue'
import CalendarioView from '@/comida/presentation/calendario/presentation/calendario-view.page.vue'
import LoginView from '@/security/presentation/login/login-view.page.vue'// Nueva vista para cambiar plan
import InicioView from '@/comida/presentation/inicio/presentation/Inicio.page.vue'
import RegisterView from '@/security/presentation/register/register-view.page.vue'

const routes = [
    {
        path: '/',
        name: 'Home',
        component: HomeView
    },
    {
        path: '/login',
        name: 'Login',
        component: LoginView, // Este es el componente Login que has creado
    },
    {
        path: '/register',
        name: 'Register',
        component: RegisterView, // Este es el componente Login que has creado
    },
    {
        path: '/foodheaven',
        name: 'FoodHeaven',
        component: FoodHeavenView,
        children: [
            {
                path: 'inicio', // Ruta padre
                name: 'Inicio',
                component: InicioView,
            },
            {
                path: 'calendario', // Ruta padre
                name: 'Calendario',
                component: CalendarioView,
            },
            {
                path: 'cuenta', // Ruta padre
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
