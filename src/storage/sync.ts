import { Storage } from './types'

export const storage = <T extends Object>(): Storage<T> => ({
    set(_key: string, value: T) {
        chrome.storage.sync.set(value)
    },

    async get(_key: string, fallback: T) {
        const stored = await chrome.storage.sync.get(fallback)
        return stored as T
    },
})
