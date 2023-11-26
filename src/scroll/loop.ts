import { options, pause, paused } from './data'
import { Line } from './types'

const progress = {
    currentLine: 0,
    currentWord: 0,
    nextUpdateTime: Date.now(),
}

export function ticker(lines: Line[], paragraphs: number[]) {
    const scrollSlide = document.getElementsByClassName(
        'scroll-slide',
    )[0] as HTMLElement
    if (!scrollSlide) return

    scrollSlide.innerHTML = lines[0].html

    document.addEventListener(
        'keydown',
        function(e: KeyboardEvent) {
            let jump = 0
            switch (e.key) {
                case 'ArrowLeft':
                    e.preventDefault()
                    if (progress.currentLine === 0) return

                    jump = progress.currentLine - 1
                    break
                case 'ArrowRight':
                    e.preventDefault()

                    if (progress.currentLine >= lines.length - 1) return
                    jump = progress.currentLine + 1

                    break
                case 'ArrowUp': {
                    e.preventDefault()
                    const paragraphIndex = Math.max(
                        0,
                        lines[progress.currentLine].paragraph - 1,
                    )
                    jump = paragraphs[paragraphIndex]

                    break
                }
                case 'ArrowDown': {
                    e.preventDefault()
                    const paragraphIndex = Math.min(
                        lines[progress.currentLine].paragraph + 1,
                        paragraphs.length - 1,
                    )
                    jump = paragraphs[paragraphIndex]

                    break
                }
                default:
                    return
            }
            if (!paused && options.pauseOnNavigate) pause()
            setParagraph(jump, lines, options.newParagraphRest)
        }.bind(progress),
    )

    const interval = setInterval(() => {
        if (!paused && Date.now() >= progress.nextUpdateTime) {
            if (progress.currentLine >= lines.length) {
                clearInterval(interval)
            } else if (
                progress.currentWord >= lines[progress.currentLine].count
            ) {
                setParagraph(progress.currentLine + 1, lines)
            } else {
                const { current, next } = scrollWords(progress.currentWord)
                progress.currentWord = current
                progress.nextUpdateTime = next
            }
        }
    })
}

function scrollWords(currentWord: number) {
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

// export function jumpLine(dir: 1 | -1) { }
//
// export function jumpParagraph(dir: 1 | -1) {
//     if (!paused && options.pauseOnNavigate) pause()
//     setParagraph(jump, lines, options.newParagraphRest)
// }

function setParagraph(
    lineIndex: number,
    lines: Line[],
    rest: number = options.newLineRest,
) {
    const line = lines[lineIndex]

    if (!line) return
    progress.currentLine = lineIndex
    progress.currentWord = 0
    progress.nextUpdateTime = Date.now() + rest

    const scrollContainer = document.getElementsByClassName(
        'scroll-slide',
    )[0] as HTMLElement
    scrollContainer.innerHTML = line.html
    document.getElementById(`0`)?.classList.add('scroll-highlight')
    document.getElementById(`1`)?.classList.add('scroll-highlight-pre')
}
