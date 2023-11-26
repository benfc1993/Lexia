import { Storage } from './types'

export const storage = (): Storage => ({
    set: <T>(_key: string, value: T) => {
        chrome.storage.sync.set(value as Object)
    },

    get: async <T>(_key: string, fallback: T) => {
        const stored = await chrome.storage.sync.get(fallback as Object)
        return stored as T
    },
})
