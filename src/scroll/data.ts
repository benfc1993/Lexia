import { storage } from '../storage/localStorage'
import { Storage, AsyncStorage } from '../storage/types'
import { eventChecked, eventValue } from '../utils/htmlHelpers'
import { parse } from './parse'
import { ticker } from './ticker'
import { BooleanOption, NumberOption, StringOption } from './types'

type Options = {
    wps: NumberOption
    commaRest: NumberOption
    fullStopRest: NumberOption
    newLineRest: NumberOption
    newParagraphRest: NumberOption
    sectionLength: NumberOption
    textColor: StringOption
    highlightColor: StringOption
    pauseOnNavigate: BooleanOption
    hideInstructions: BooleanOption
}

export const options: Options = {
    wps: {
        value: 8,
        get default() {
            return 8
        },
        type: 'number',
        reset() {
            this.value = this.default
            optionStorage.set(StorageKey.Options, options)
        },
        onChange(e) {
            this.value = Math.max(0.1, parseInt(eventValue(e)))
            optionStorage.set(StorageKey.Options, options)
        }
    },
    commaRest: {
        value: 100,
        get default() {
            return 100
        },
        type: 'number',
        reset() {
            this.value = this.default
            optionStorage.set(StorageKey.Options, options)
        },
        onChange(e) {
            this.value = parseInt(eventValue(e))
            optionStorage.set(StorageKey.Options, options)
        }
    },
    fullStopRest: {
        value: 250,
        get default() {
            return 250
        },
        type: 'number',
        reset() {
            this.value = this.default
            optionStorage.set(StorageKey.Options, options)
        },
        onChange(e) {
            this.value = parseInt(eventValue(e))
            optionStorage.set(StorageKey.Options, options)
        }
    },
    newLineRest: {
        value: 50,
        get default() {
            return 50
        },
        type: 'number',
        reset() {
            this.value = this.default
            optionStorage.set(StorageKey.Options, options)
        },
        onChange(e) {
            this.value = parseInt(eventValue(e))
            optionStorage.set(StorageKey.Options, options)
        }
    },
    newParagraphRest: {
        value: 50,
        get default() {
            return 50
        },
        type: 'number',
        reset() {
            this.value = this.default
            optionStorage.set(StorageKey.Options, options)
        },
        onChange(e) {
            this.value = parseInt(eventValue(e))
            optionStorage.set(StorageKey.Options, options)
        }
    },
    sectionLength: {
        value: 8,
        get default() {
            return 8
        },
        type: 'number',
        reset() {
            this.value = this.default
            optionStorage.set(StorageKey.Options, options)
        },
        onChange(e) {
            const newLineIndex = Math.floor(
                (this.value * ticker.currentLine + ticker.currentWord - 1) /
                    parseInt(eventValue(e))
            )

            this.value = parseInt(eventValue(e))
            optionStorage.set(StorageKey.Options, options)

            if (!ticker.parentElement) return

            const { lines, paragraphs, pTags } = parse(ticker.parentElement)
            ticker.setData(lines, paragraphs, pTags, ticker.parentElement)
            ticker.pause()

            ticker.setLine(newLineIndex)
        }
    },
    textColor: {
        value: '#3f3f3f',
        get default() {
            return '#3f3f3f'
        },
        type: 'string',
        inputType: 'color',
        cssVar: 'textColor',
        reset() {
            this.value = this.default
            optionStorage.set(StorageKey.Options, options)
            updateCssVar(this.cssVar!, this.value)
        },
        onChange(e) {
            this.value = eventValue(e)
            optionStorage.set(StorageKey.Options, options)
            updateCssVar(this.cssVar!, this.value)
        }
    },
    highlightColor: {
        value: '#ffffff',
        get default() {
            return '#ffffff'
        },
        type: 'string',
        inputType: 'color',
        cssVar: 'highlightColor',
        reset() {
            this.value = this.default
            optionStorage.set(StorageKey.Options, options)
            updateCssVar(this.cssVar!, this.value)
        },
        onChange(e) {
            this.value = eventValue(e)
            optionStorage.set(StorageKey.Options, options)
            updateCssVar(this.cssVar!, this.value)
        }
    },
    pauseOnNavigate: {
        value: true,
        get default() {
            return true
        },
        type: 'boolean',
        reset() {
            this.value = this.default
            optionStorage.set(StorageKey.Options, options)
        },
        onChange(e) {
            this.value = eventChecked(e)
            optionStorage.set(StorageKey.Options, options)
        }
    },
    hideInstructions: {
        value: true,
        get default() {
            return false
        },
        type: 'boolean',
        reset() {
            this.value = this.default
            optionStorage.set(StorageKey.Options, options)
            const instructions = document.getElementById('lexia-instructions')

            instructions?.classList.remove('hide')
        },
        onChange(e) {
            this.value = eventChecked(e)

            const instructions = document.getElementById('lexia-instructions')
            if (this.value) instructions?.classList.add('hide')
            else instructions?.classList.remove('hide')
            optionStorage.set(StorageKey.Options, options)
        }
    }
}

enum StorageKey {
    Options = 'lexia-options',
    ColorOptions = 'lexia-color-options'
}

let optionStorage: Storage | AsyncStorage = storage()

export function setStorageMethod(storage: Storage | AsyncStorage) {
    optionStorage = storage
}

export function updateCssVar(key: string, value: string) {
    const r = document.querySelector(':root') as HTMLElement
    r?.style.setProperty(`--${key}`, value)
}

export async function assignDefaults() {
    const storedOptions = await optionStorage.get(StorageKey.Options, options)
    Object.keys(options).forEach((key) => {
        const keyT = key as keyof typeof options
        options[keyT].value = storedOptions[keyT].value

        const input = document.getElementById(
            `lexia-option-${keyT}`
        ) as HTMLInputElement
        if (input) {
            const option = options[keyT]
            if (option.type === 'boolean') {
                input.checked = option.value
            } else {
                input.value = options[keyT].value.toString()
            }
        }
    })

    const root = document.querySelector(':root') as HTMLElement

    if (!root) return

    for (const option of Object.values(options)) {
        if (option.cssVar && option.type === 'string')
            root.style.setProperty(`--${option.cssVar}`, option.value)
    }
}

export function resetDefault(key: keyof typeof options) {
    options[key].reset()

    const input = document.getElementById(
        `lexia-option-${key}`
    ) as HTMLInputElement
    options[key].type === 'boolean'
        ? (input.checked = options[key].default as boolean)
        : (input.value = options[key].default.toString())
}
