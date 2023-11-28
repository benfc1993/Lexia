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
    pTags: HTMLElement[]
    parentElement: HTMLElement | null
    containerElement: HTMLElement | null
    tick: () => void
    setData: (
        lines: Line[],
        paragraphs: number[],
        pTags: HTMLElement[],
        parentElement: HTMLElement,
        containerElement?: HTMLElement,
    ) => void
    pause: () => void
    togglePause: () => void
    jumpLine: (dir: 1 | -1) => void
    jumpParagraph: (dir: 1 | -1) => void
    setLine: (lineIndex: number, rest?: number) => void
    end: () => void
}

export const ticker: Ticker = {
    paused: false,
    currentLine: 0,
    currentWord: 0,
    nextUpdateTime: Date.now(),
    lines: [],
    paragraphs: [],
    pTags: [],
    parentElement: null,
    containerElement: null,
    setData(
        lines: Line[],
        paragraphs: number[],
        pTags: HTMLElement[],
        parentElement: HTMLElement,
        containerElement?: HTMLElement,
    ) {
        this.lines = lines
        this.paragraphs = paragraphs
        this.pTags = pTags
        this.parentElement = parentElement
        this.containerElement = containerElement ?? this.containerElement
        this.paused = false
        this.currentWord = 0
        this.currentLine = 0
        this.nextUpdateTime = Date.now()
    },
    tick() {
        if (!this.containerElement) return
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
            const { current, next } = scrollWords(
                this.containerElement,
                this.currentWord,
            )
            this.currentWord = current
            this.nextUpdateTime = next
        }
        requestAnimationFrame(this.tick.bind(this))
    },
    pause() {
        this.paused = true
        document.getElementById('lexia-scroll-pause')?.classList.add('show')
    },
    togglePause() {
        this.paused = !this.paused
        document.getElementById('lexia-scroll-pause')?.classList.toggle('show')
    },
    jumpLine(dir: 1 | -1) {
        if (options.pauseOnNavigate.value) this.pause()
        const jump = Math.max(
            0,
            Math.min(this.currentLine + dir, ticker.lines.length - 1),
        )
        this.setLine(jump, options.newParagraphRest.value)
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
        if (options.pauseOnNavigate.value) this.pause()
        this.setLine(jump, options.newParagraphRest.value)
    },
    setLine(lineIndex: number, rest: number = options.newLineRest.value) {
        const line = this.lines[lineIndex]

        if (!line) return
        ticker.currentLine = lineIndex
        ticker.currentWord = 0
        ticker.nextUpdateTime = Date.now() + rest

        const postLine = document.getElementById('lexia-scroll-line-post')!
        postLine.innerHTML = ''
        if (postLine && lineIndex - 1 >= 0) {
            if (line.paragraph === this.lines[lineIndex - 1].paragraph)
                postLine.innerHTML = `<div>${
                    this.lines[lineIndex - 1].html
                }</div`
        }

        const scrollContainer = document.getElementsByClassName(
            'lexia-scroll-slide',
        )[0] as HTMLElement

        const preLine = document.getElementById('lexia-scroll-line-pre')!
        preLine.innerHTML = ''
        if (preLine && lineIndex + 1 < this.lines.length) {
            if (line.paragraph == this.lines[lineIndex + 1].paragraph)
                preLine.innerHTML = `<div>${
                    this.lines[lineIndex + 1].html
                }</div>`
        }

        scrollContainer.innerHTML = line.html
        document.getElementById(`0`)?.classList.add('lexia-scroll-highlight')
        document
            .getElementById(`1`)
            ?.classList.add('lexia-scroll-highlight-pre')
    },
    end() {
        this.lines = []
        this.paragraphs = []
        this.currentWord = 0
        this.currentLine = 0
        this.paused = false
        this.containerElement = null
    },
}
