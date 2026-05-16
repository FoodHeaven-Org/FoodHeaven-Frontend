import { apiClient } from '@/shared/infrastructure/http/api-client.js'
import { getCurrentUserId } from '@/security/application/internal/auth-api.service.js'

export class AccountApiService {
    async getCurrentProfile() {
        const userId = getCurrentUserId()

        if (!userId) {
            throw new Error('There is no authenticated user in the current session.')
        }

        const response = await apiClient.get(`/User/${userId}`)
        return response.data
    }
}
