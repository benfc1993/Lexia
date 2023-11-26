import { camelToScentence } from '../utils/text-transform'
import {
    colorOptionChange,
    colorOptions,
    optionChange,
    options,
    resetDefault,
} from './data'

export function createLayout() {
    const overlay = document.createElement('div')
    overlay.classList.add('lexia-scroll-overlay')

    const container = document.createElement('div')
    container.classList.add('lexia-scroll-container')
    overlay.appendChild(container)

    const slide = document.createElement('div')
    slide.classList.add('lexia-scroll-slide')
    container.appendChild(slide)

    const pause = document.createElement('div')
    pause.classList.add('lexia-pause')
    pause.id = 'lexia-scroll-pause'
    overlay.appendChild(pause)

    document.body.appendChild(overlay)
    createOptionsLayout(overlay)
}

const inputTypes = {
    boolean: 'checkbox',
    string: 'text',
    number: 'number',
} as const

function createOptionsLayout(parent: Node) {
    const optionsContainer = document.createElement('div')
    optionsContainer.id = 'lexia-scroll-options'
    optionsContainer.classList.add('lexia-scroll-options', 'hide')

    const header = document.createElement('h3')
    header.classList.add('lexia-scroll-options__header')
    header.innerText = 'options'
    optionsContainer.appendChild(header)

    for (const [key, value] of Object.entries(options)) {
        const valueType = typeof value
        const input = createOptionInput(
            key,
            value.toString(),
            inputTypes[valueType as keyof typeof inputTypes] ?? '',
            optionChange,
        ) as HTMLInputElement

        if (key === 'wps')
            input.querySelector('#lexia-option-wps')?.setAttribute('min', '0.1')
        optionsContainer.appendChild(input)
    }

    for (const [key, value] of Object.entries(colorOptions)) {
        const input = createOptionInput(key, value, 'color', colorOptionChange)
        optionsContainer.appendChild(input)
    }

    parent.appendChild(optionsContainer)
}

function createOptionInput(
    key: string,
    value: string,
    type: string,
    onChange: (key: string, value: string) => void,
) {
    const inputContainer = document.createElement('div')
    const label = document.createElement('label')
    label.innerText = camelToScentence(key)
    label.setAttribute('for', `lexia-option-${key}`)

    const wrapper = document.createElement('div')
    wrapper.classList.add('lexia-scroll-options__input-wrapper')

    const input = document.createElement('input')
    input.classList.add('lexia-scroll-options__input')
    input.type = type
    input.id = `lexia-option-${key}`
    input.name = `lexia-option-${key}`
    type === 'checkbox'
        ? (input.checked = value === 'true' ? true : false)
        : (input.value = value.toString())
    input.addEventListener('change', (e: Event) =>
        onChange(
            key,
            type === 'checkbox'
                ? (e.target as HTMLInputElement)?.checked.toString()
                : (e.target as HTMLInputElement)?.value,
        ),
    )

    const resetButton = document.createElement('button')
    resetButton.innerText = '↺'
    resetButton.onclick = (_e: MouseEvent) =>
        resetDefault(key as keyof typeof options)

    wrapper.appendChild(input)
    wrapper.appendChild(resetButton)

    inputContainer.appendChild(label)
    inputContainer.appendChild(wrapper)
    return inputContainer
}
