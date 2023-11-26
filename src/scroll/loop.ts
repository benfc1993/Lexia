import { options } from './data'
import { ticker } from './ticker'
import { Line } from './types'

export function loop(lines: Line[], paragraphs: number[]) {
    const scrollSlide = document.getElementsByClassName(
        'scroll-slide',
    )[0] as HTMLElement
    if (!scrollSlide) return

    scrollSlide.innerHTML = lines[0].html

    ticker.setData(lines, paragraphs)

    ticker.tick()
}

export function scrollWords(currentWord: number) {
    document
        .getElementById((currentWord - 2).toString())
        ?.classList.remove('scroll-highlight-post')
    document
        .getElementById((currentWord - 1).toString())
        ?.classList.replace('scroll-highlight', 'scroll-highlight-post')
    const nextEl = document.getElementById((currentWord + 1).toString())
    nextEl?.classList.add('scroll-highlight-pre')

    const current = document.getElementById(
        currentWord.toString(),
    ) as HTMLElement

    current?.classList.replace('scroll-highlight-pre', 'scroll-highlight')
    let next =
        Date.now() +
        1000 / Math.max(options.wps, 0.1) +
        (current.innerText.length - 6) * 10
    if (!nextEl) {
        next += 50
    }

    next +=
        options.newParagraphRest *
        (current.classList.contains('new-paragraph') ? 1 : 0)

    if (current.innerText.match(/^\w+[\,\;][\s\'\"“”]?\s?$/))
        next += options.commaRest

    if (current.innerText.match(/^\w+\.[\s\'\"“”]?\s?$/))
        next += options.fullStopRest

    return { current: currentWord + 1, next }
}
