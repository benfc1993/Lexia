import { Storage } from './types'

export const storage = (): Storage => ({
    set: <T>(key: string, value: T) => {
        localStorage.setItem(key, JSON.stringify(value))
    },

    get: <T>(key: string, fallback: T) => {
        const stored = localStorage.getItem(key)
        if (!stored) return fallback

        return JSON.parse(stored) as T
    },
})
