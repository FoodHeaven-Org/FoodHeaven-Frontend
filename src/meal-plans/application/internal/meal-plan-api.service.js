import { apiClient } from '@/shared/infrastructure/http/api-client.js'
import { getCurrentUserId } from '@/security/application/internal/auth-api.service.js'

export class MealPlanApiService {
    async getCurrentUserMealPlans() {
        const userId = getCurrentUserId()

        if (!userId) {
            throw new Error('There is no authenticated user in the current session.')
        }

        try {
            const response = await apiClient.get(`/PlanComida/${userId}`)
            return response.data
        } catch (error) {
            if (error.response?.status === 404) return []
            throw error
        }
    }

    async createWeeklyMealPlan({ fechaInicio, fechaFin, listaComidas }) {
        const userId = getCurrentUserId()

        if (!userId) {
            throw new Error('There is no authenticated user in the current session.')
        }

        const response = await apiClient.post('/PlanComida', {
            idUsuario: userId,
            fechaInicio,
            fechaFin,
            listaComidas
        })

        return response.data
    }
}
