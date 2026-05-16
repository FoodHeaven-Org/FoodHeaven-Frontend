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

    async updateCurrentProfile({ fullName, username, phone, city }) {
        const userId = getCurrentUserId()

        if (!userId) {
            throw new Error('There is no authenticated user in the current session.')
        }

        const response = await apiClient.put(`/User/${userId}/profile`, {
            fullName,
            username,
            phone,
            city
        })
        return response.data
    }

    async changeCurrentSubscription(subscription) {
        const userId = getCurrentUserId()

        if (!userId) {
            throw new Error('There is no authenticated user in the current session.')
        }

        const response = await apiClient.put(`/User/${userId}/subscription`, {
            subscription
        })
        return response.data
    }

    async changeCurrentPassword({ currentPassword, newPassword }) {
        const userId = getCurrentUserId()

        if (!userId) {
            throw new Error('There is no authenticated user in the current session.')
        }

        await apiClient.put(`/User/${userId}/password`, {
            currentPassword,
            newPassword
        })
    }
}
