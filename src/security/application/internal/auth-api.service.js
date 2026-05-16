import { apiClient } from '@/shared/infrastructure/http/api-client.js'

const TOKEN_KEY = 'foodheaven.token'
const SID_CLAIM = 'http://schemas.xmlsoap.org/ws/2005/05/identity/claims/sid'
const NAME_CLAIM = 'http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name'
const ROLE_CLAIM = 'http://schemas.microsoft.com/ws/2008/06/identity/claims/role'

export class AuthApiService {
    async login({ username, password }) {
        const response = await apiClient.post('/User/login', { username, password })
        const token = typeof response.data === 'string' ? response.data : response.data?.token

        if (!token) {
            throw new Error('The backend did not return an authentication token.')
        }

        saveSession(token)
        return token
    }

    async signUp({ fullName, username, password, subscription, phone, city }) {
        const response = await apiClient.post('/User/sign-up', {
            fullName,
            username,
            password,
            subscription,
            phone,
            city
        })

        return response.data
    }

    async getCurrentUser() {
        const userId = getCurrentUserId()

        if (!userId) {
            throw new Error('There is no authenticated user in the current session.')
        }

        const response = await apiClient.get(`/User/${userId}`)
        return response.data
    }
}

export function saveSession(token) {
    localStorage.setItem(TOKEN_KEY, token)
}

export function clearSession() {
    localStorage.removeItem(TOKEN_KEY)
}

export function getCurrentToken() {
    return localStorage.getItem(TOKEN_KEY)
}

export function hasActiveSession() {
    return Boolean(getCurrentUserId())
}

export function getCurrentUserId() {
    const payload = getSessionPayload()
    const userId = payload?.[SID_CLAIM] ?? payload?.sid ?? payload?.sub ?? payload?.nameid
    return userId ? Number(userId) : null
}

export function getSessionUser() {
    const payload = getSessionPayload()

    if (!payload) return null

    return {
        id: getCurrentUserId(),
        username: payload[NAME_CLAIM] ?? payload.name ?? '',
        fullName: payload.fullName ?? '',
        subscription: payload[ROLE_CLAIM] ?? payload.role ?? '',
        phone: payload.phone ?? '',
        city: payload.city ?? ''
    }
}

function getSessionPayload() {
    const token = getCurrentToken()
    if (!token) return null

    const [, payload] = token.split('.')
    if (!payload) return null

    try {
        return JSON.parse(atob(toBase64(payload)))
    } catch (error) {
        console.error(error)
        clearSession()
        return null
    }
}

function toBase64(base64Url) {
    const normalized = base64Url.replace(/-/g, '+').replace(/_/g, '/')
    const padding = normalized.length % 4 === 0 ? '' : '='.repeat(4 - (normalized.length % 4))
    return normalized + padding
}
