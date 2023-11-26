import { storage } from '../storage/localStorage'

const defaults = {
    wps: 9,
    commaRest: 100,
    fullStopRest: 250,
    newLineRest: 50,
    newParagraphRest: 250,
    sectionLength: 8,
    textColor: '#3f3f3f',
    highlightColor: '#ffffff',
    pauseOnNavigate: true,
}

export const options = {
    wps: 9,
    commaRest: 100,
    fullStopRest: 250,
    newLineRest: 50,
    newParagraphRest: 250,
    sectionLength: 8,
    pauseOnNavigate: true,
}

export const colorOptions = {
    textColor: '#3f3f3f',
    highlightColor: '#ffffff',
}

enum StorageKey {
    Options = 'lexia-options',
    ColorOptions = 'lexia-color-options',
}

const optionStorage = storage()

export function optionChange(key: string, value: string) {
    console.log(value)
    if (value === 'true' || value === 'false') {
        // @ts-ignore
        options[key as keyof typeof options] = value === 'true' ? true : false
    } else {
        // @ts-ignore
        options[key as keyof typeof options] = parseInt(value)
    }
    optionStorage.set(StorageKey.Options, options)
}

export function colorOptionChange(key: string, value: string) {
    colorOptions[key as keyof typeof colorOptions] = value
    optionStorage.set(StorageKey.ColorOptions, colorOptions)
    const r = document.querySelector(':root') as HTMLElement
    r?.style.setProperty(`--${key}`, value)
}

export function assignDefaults() {
    const storedOptions = optionStorage.get(StorageKey.Options, options)
    Object.assign(options, storedOptions)

    const storedColorOptions = optionStorage.get(
        StorageKey.ColorOptions,
        colorOptions,
    )
    Object.assign(colorOptions, storedColorOptions)

    const root = document.querySelector(':root') as HTMLElement

    if (!root) return

    for (const [key, value] of Object.entries(colorOptions))
        root.style.setProperty(`--${key}`, value)
}

export function resetDefault(
    key: keyof typeof options | keyof typeof colorOptions,
) {
    if (key in options) {
        optionChange(key, defaults[key].toString())
    }
    if (key in colorOptions) {
        colorOptions[key as keyof typeof colorOptions] = defaults[key] as any
        colorOptionChange(key, defaults[key].toString())
    }

    const input = document.getElementById(
        `lexia-option-${key}`,
    ) as HTMLInputElement
    typeof defaults[key] === 'boolean'
        ? (input.checked = defaults[key] as boolean)
        : (input.value = defaults[key].toString())
}
