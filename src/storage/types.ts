export interface Storage {
    get: <TData>(key: string, fallback: TData) => TData
    set: <TData>(key: string, value: TData) => void
}

export interface AsyncStorage {
    get: <TData>(key: string, fallback: TData) => Promise<TData>
    set: <TData>(key: string, value: TData) => void
}
