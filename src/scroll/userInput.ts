import { ticker } from './ticker'

export function initialiseUserInput() {
    document.addEventListener('keydown', function (e: KeyboardEvent) {
        switch (e.key) {
            case ' ':
                e.preventDefault()
                ticker.pause()
                break
            case 'o':
            case 'O':
                e.preventDefault()
                document
                    .getElementById('lexia-scroll-options')
                    ?.classList.toggle('hide')
                break
            default:
                return
        }
    })
    document.addEventListener('keydown', function (e: KeyboardEvent) {
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
    })
}
