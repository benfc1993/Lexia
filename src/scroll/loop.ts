import { options } from './data'
import { ticker } from './ticker'
import { Line } from './types'

export function loop(lines: Line[], paragraphs: number[]) {
    const scrollSlide = document.getElementsByClassName(
        'lexia-scroll-slide',
    )[0] as HTMLElement
    if (!scrollSlide) return

    ticker.setData(
        document.getElementById('lexia-scroll-slide')!,
        lines,
        paragraphs,
    )

    ticker.setLine(0)
    ticker.tick()
}

export function scrollWords(
    containerElement: HTMLElement,
    currentWord: number,
) {
    if (currentWord >= 2)
        containerElement
            .querySelector(`#lexia-word-${(currentWord - 2).toString()}`)
            ?.classList.remove('lexia-scroll-highlight-post')
    if (currentWord >= 1)
        containerElement
            .querySelector(`#lexia-word-${(currentWord - 1).toString()}`)
            ?.classList.replace(
                'lexia-scroll-highlight',
                'lexia-scroll-highlight-post',
            )
    const nextEl = containerElement.querySelector(
        `#lexia-word-${(currentWord + 1).toString()}`,
    )
    nextEl?.classList.add('lexia-scroll-highlight-pre')

    const current = containerElement.querySelector(
        `#lexia-word-${currentWord.toString()}`,
    ) as HTMLElement

    current?.classList.remove('lexia-scroll-highlight-pre')

    current?.classList.add('lexia-scroll-highlight')
    let next =
        Date.now() +
        1000 / Math.max(options.wps.value, 0.1) +
        (current.innerText.length - 6) * 10
    if (!nextEl) {
        next += 50
    }

    next +=
        options.newParagraphRest.value *
        (current.classList.contains('lexia-new-paragraph') ? 1 : 0)

    if (current.innerText.match(/^\w+[\,\;][\s\'\"“”]?\s?$/))
        next += options.commaRest.value

    if (current.innerText.match(/^\w+\.[\s\'\"“”]?\s?$/))
        next += options.fullStopRest.value

    return { current: currentWord + 1, next }
}
