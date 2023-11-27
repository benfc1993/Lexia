import type { Options } from '../src/lexia.ts'
// Saves options to chrome.storage
const saveOptions = async () => {
    const options: Options = {
        highlight: false,
        punc: false,
        first: false,
        conj: false,
        prep: false,
        center: false,
    }
    Object.keys(options).forEach((option) => {
        options[option as keyof typeof options] = (document.getElementById(
            option,
        ) as HTMLInputElement)!.checked
    })

    console.log(options)
    chrome.storage.sync.set(options, () => {
        // Update status to let user know options were saved.
        const status = document.getElementById('status')!
        status.textContent = 'Options saved.'
        chrome.runtime.sendMessage('run')
        setTimeout(() => {
            status.textContent = ''
        }, 750)
    })
}

// Restores select box and checkbox state using the preferences
// stored in chrome.storage.
const restoreOptions = () => {
    const options: Options = {
        highlight: false,
        punc: false,
        first: false,
        conj: false,
        prep: false,
        center: false,
    }
    chrome.storage.sync.get(options, (items) => {
        Object.keys(items).forEach(
            (item) =>
            ((document.getElementById(item) as HTMLInputElement)!.checked =
                items[item]),
        )
    })
}

document.addEventListener('DOMContentLoaded', restoreOptions)
document.getElementById('save')!.addEventListener('click', saveOptions)
document
    .getElementById('start-scroll')!
    .addEventListener('click', () => chrome.runtime.sendMessage('start-scroll'))
