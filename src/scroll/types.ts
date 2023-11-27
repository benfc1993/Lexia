type BaseOption<T> = {
    value: T
    default: Readonly<T>
    onChange: (e: Event) => void
    reset: () => void
    cssVar?: string
    type: T extends string
        ? 'string'
        : T extends number
        ? 'number'
        : T extends boolean
        ? 'boolean'
        : T extends undefined
        ? 'undefined'
        : 'object'
}
export type StringOption = BaseOption<string> & {}
export type NumberOption = BaseOption<number> & {}
export type BooleanOption = BaseOption<boolean> & {}
export type Option = StringOption | NumberOption | BooleanOption

export type Line = {
    count: number
    html: string
    paragraph: number
}
