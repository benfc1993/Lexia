import { quit } from './parse'
import { ticker } from './ticker'
function controlsInput(e: KeyboardEvent) {
    switch (e.key) {
        case ' ':
            e.preventDefault()
            ticker.togglePause()
            break
        case 'o':
        case 'O':
            e.preventDefault()
            document
                .getElementById('lexia-scroll-options')
                ?.classList.toggle('hide')
            break
        case 'Escape':
            quit()
        default:
            return
    }
}

function navigationInput(e: KeyboardEvent) {
    switch (e.key) {
        case 'ArrowLeft':
            e.preventDefault()
            ticker.jumpLine(-1)
            break
        case 'ArrowRight':
            e.preventDefault()

            ticker.jumpLine(1)
            break
        case 'ArrowUp': {
            e.preventDefault()
            ticker.jumpParagraph(-1)
            break
        }
        case 'ArrowDown': {
            e.preventDefault()
            ticker.jumpParagraph(1)
            break
        }
        default:
            return
    }
}
export function initialiseUserInput() {
    document.addEventListener('keydown', controlsInput)

    document.addEventListener('keydown', navigationInput)
}
export function removeUserInput() {
    document.removeEventListener('keydown', controlsInput)

    document.removeEventListener('keydown', navigationInput)
}
