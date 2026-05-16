import { apiClient } from '@/shared/infrastructure/http/api-client.js'

export class ComidasApiService {
    async getMealsByType(typeId) {
        return apiClient.get('/Comida', {
            params: { id_tipo_comida: typeId }
        })
    }

    async getAllMeals() {
        return apiClient.get('/Comida')
    }

    async getBreakfastMeals() {
        return this.getMealsByType(1)
    }

    async getLunchMeals() {
        return this.getMealsByType(2)
    }

    async getDinnerMeals() {
        return this.getMealsByType(3)
    }
}
