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
            this.value = parseInt(eventValue(e))
            optionStorage.set(StorageKey.Options, options)
        },
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
        },
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
        },
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
        },
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
        },
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
                    parseInt(eventValue(e)),
            )
            console.log(
                'wordIndex: ',
                this.value * ticker.currentLine + ticker.currentWord - 1,
            )
            console.log('previous line index: ', ticker.currentLine)
            console.log('new line index: ', newLineIndex)
            this.value = parseInt(eventValue(e))
            optionStorage.set(StorageKey.Options, options)
            const { lines, paragraphs } = parse()
            ticker.setData(lines, paragraphs)
            ticker.pause()

            ticker.setLine(newLineIndex)
        },
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
        },
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
        },
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
        },
    },
}

enum StorageKey {
    Options = 'lexia-options',
    ColorOptions = 'lexia-color-options',
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
            `lexia-option-${keyT}`,
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
        `lexia-option-${key}`,
    ) as HTMLInputElement
    typeof options[key].type === 'boolean'
        ? (input.checked = options[key].default as boolean)
        : (input.value = options[key].default.toString())
}
