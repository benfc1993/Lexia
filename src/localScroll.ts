import { startScroll } from './scroll/parse'
import { storage } from './storage/localStorage'

const main = () => {
    // for local version only do not use in extension
    const startScrollButton = document.getElementById('scroll')
    if (!startScrollButton) return
    startScrollButton.onclick = (e: MouseEvent) => {
        e.preventDefault()
        startScroll(storage())
    }
}

main()
