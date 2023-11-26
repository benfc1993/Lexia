export interface Storage {
    get: <TData>(key: string, fallback: TData) => TData | Promise<TData>
    set: <TData>(key: string, value: TData) => void
}
