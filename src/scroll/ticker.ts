import { options } from './data'
import { scrollWords } from './loop'
import { Line } from './types'

export interface Ticker {
    paused: boolean
    currentLine: number
    currentWord: number
    nextUpdateTime: number
    lines: Line[]
    paragraphs: number[]
    tick: () => void
    setData: (lines: Line[], paragraphs: number[]) => void
    pause: () => void
    jumpLine: (dir: 1 | -1) => void
    jumpParagraph: (dir: 1 | -1) => void
    setLine: (lineIndex: number, rest?: number) => void
}

export const ticker: Ticker = {
    paused: false,
    currentLine: 0,
    currentWord: 0,
    nextUpdateTime: Date.now(),
    lines: [],
    paragraphs: [],
    setData(lines: Line[], paragraphs: number[]) {
        this.lines = lines
        this.paragraphs = paragraphs
    },
    tick() {
        if (
            this.currentLine >= this.lines.length ||
            this.paused ||
            Date.now() <= this.nextUpdateTime
        ) {
            requestAnimationFrame(this.tick.bind(this))
            return
        }

        if (this.currentWord >= this.lines[this.currentLine].count) {
            this.setLine(this.currentLine + 1)
        } else {
            const { current, next } = scrollWords(this.currentWord)
            this.currentWord = current
            this.nextUpdateTime = next
        }
        requestAnimationFrame(this.tick.bind(this))
    },
    pause() {
        this.paused = !this.paused
        document.getElementById('lexia-scroll-pause')?.classList.toggle('show')
    },
    jumpLine(dir: 1 | -1) {
        if (!this.paused && options.pauseOnNavigate) this.pause()
        const jump = Math.max(
            0,
            Math.min(this.currentLine + dir, ticker.lines.length - 1),
        )
        this.setLine(jump, options.newParagraphRest)
    },

    jumpParagraph(dir: 1 | -1) {
        const paragraphIndex = Math.max(
            0,
            Math.min(
                this.lines[this.currentLine].paragraph + dir,
                this.paragraphs.length - 1,
            ),
        )
        let jump = this.paragraphs[paragraphIndex]
        if (!this.paused && options.pauseOnNavigate) this.pause()
        this.setLine(jump, options.newParagraphRest)
    },
    setLine(lineIndex: number, rest: number = options.newLineRest) {
        const line = this.lines[lineIndex]

        if (!line) return
        ticker.currentLine = lineIndex
        ticker.currentWord = 0
        ticker.nextUpdateTime = Date.now() + rest

        const scrollContainer = document.getElementsByClassName(
            'lexia-scroll-slide',
        )[0] as HTMLElement
        scrollContainer.innerHTML = line.html
        document.getElementById(`0`)?.classList.add('lexia-scroll-highlight')
        document
            .getElementById(`1`)
            ?.classList.add('lexia-scroll-highlight-pre')
    },
}
