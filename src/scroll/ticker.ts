export interface Ticker {
    paused: boolean
    currentLine: number
    currentWord: number
    nextUpdateTime: number
    lines: Line[]
    tick: () => void
}

const tickerO: Ticker = {
    paused: false,
    currentLine: 0,
    currentWord: 0,
    nextUpdateTime: Date.now(),
    lines: [],
    tick() {
        if (this.currentLine >= this.lines.length) return
        if (this.paused) return
        if (Date.now() >= progress.nextUpdateTime) return

        if (this.currentWord >= this.lines[this.currentLine].count) {
            setParagraph(this.currentLine + 1, this.lines)
        } else {
            const { current, next } = scrollWords(this.currentWord)
            this.currentWord = current
            this.nextUpdateTime = next
        }
    },
}
