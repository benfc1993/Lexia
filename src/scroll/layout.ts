import { camelToScentence } from '../utils/text-transform'
import { options, resetDefault } from './data'
import type { Option } from './types'

export function createLayout() {
    const overlay = document.createElement('div')
    overlay.classList.add('lexia-scroll-overlay')
    overlay.id = 'lexia-scroll-overlay'

    const post = document.createElement('div')
    post.classList.add('lexia-scroll-line-post', 'lexia-scroll-container')
    post.id = 'lexia-scroll-line-post'
    overlay.appendChild(post)

    const container = document.createElement('div')
    container.classList.add('lexia-scroll-container')

    overlay.appendChild(container)

    const slide = document.createElement('div')
    slide.classList.add('lexia-scroll-slide')
    slide.id = 'lexia-scroll-slide'
    container.appendChild(slide)

    const pre = document.createElement('div')
    pre.classList.add('lexia-scroll-line-pre', 'lexia-scroll-container')
    pre.id = 'lexia-scroll-line-pre'
    overlay.appendChild(pre)

    const pause = document.createElement('div')
    pause.classList.add('lexia-pause')
    pause.id = 'lexia-scroll-pause'
    overlay.appendChild(pause)

    const instructionsContainer = document.createElement('div')
    instructionsContainer.classList.add('lexia-instructions-container')
    if (options.hideInstructions.value)
        instructionsContainer.classList.add('hide')
    instructionsContainer.id = 'lexia-instructions'

    const escape = document.createElement('p')
    escape.innerText = 'Esc to quit'
    instructionsContainer.appendChild(escape)

    const space = document.createElement('p')
    space.innerText = 'Space to pause'
    instructionsContainer.appendChild(space)

    const optionsInstruction = document.createElement('p')
    optionsInstruction.innerText = 'O for options'
    instructionsContainer.appendChild(optionsInstruction)
    overlay.appendChild(instructionsContainer)
    document.body.appendChild(overlay)
    createOptionsLayout(overlay)
}

const inputTypes = {
    boolean: 'checkbox',
    string: 'text',
    number: 'number'
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
        const input = createOptionInput(
            key as keyof typeof options,
            value
        ) as HTMLInputElement

        optionsContainer.appendChild(input)
    }

    const controlsContainer = document.createElement('div')
    controlsContainer.classList.add('lexia-controls-container')
    optionsContainer.appendChild(controlsContainer)

    const controls = [
        '⬅ Back one line',
        '➡ Forward one line',
        '⬆ Up one paragraph',
        '⬇ Down one paragraph'
    ]
    controls.forEach((control) => {
        const el = document.createElement('p')
        el.innerText = control
        el.classList.add('lexia-control-text')
        controlsContainer.appendChild(el)
    })
    parent.appendChild(optionsContainer)
}

export function createSelectionNotification() {
    const notification = document.createElement('div')
    notification.classList.add('lexia-selection-notification')
    notification.innerText = 'Lexia Selection Active'
    document.body.appendChild(notification)
}

function createOptionInput(key: keyof typeof options, option: Option) {
    const type = option.inputType ?? inputTypes[option.type]
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
    option.type === 'boolean'
        ? (input.checked = option.value)
        : (input.value = option.value.toString())
    input.addEventListener('change', option.onChange.bind(options[key]))

    const resetButton = document.createElement('button')
    resetButton.classList.add('lexia-scroll-options__reset')
    resetButton.innerText = '↺'
    resetButton.onclick = (_e: MouseEvent) => resetDefault(key)

    wrapper.appendChild(input)
    wrapper.appendChild(resetButton)

    inputContainer.appendChild(label)
    inputContainer.appendChild(wrapper)
    return inputContainer
}
