import { assignDefaults, options, pause } from './data'
import { createLayout } from './layout'
import { ticker } from './loop'
import { Line } from './types'

const main = () => {
    const startScrollButton = document.getElementById('scroll')
    if (!startScrollButton) return
    startScrollButton.onclick = (e: MouseEvent) => {
        e.preventDefault()
        scroll()
    }
}

const scroll = () => {
    assignDefaults()
    createLayout()

    document.addEventListener('keydown', (e: KeyboardEvent) => {
        switch (e.key) {
            case ' ':
                e.preventDefault()
                pause()
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

    const tags = document.getElementsByTagName('p')
    if (!tags) return
    const lines: Line[] = []
    let paragraphIndex = 0
    let paragraphs: number[] = []

    for (const tag of tags) {
        const sections = splitWords(paragraphs.length, tag.innerText)
        paragraphs.push(paragraphIndex)
        lines.push(...sections)

        paragraphIndex += sections.length
    }
    ticker(lines, paragraphs)
}

function splitWords(paragraphIndex: number, str: string): Line[] {
    const sections: Line[] = []
    const words = str
        .replace(/\<br\>/g, ' ')
        .split(/\s/g)
        .filter((word: string | undefined) => {
            return word !== undefined && !Number.isNaN(word.charCodeAt(0))
        })
    let section = ''
    let j = 0
    for (let i = 0; i < words.length; i++, j++) {
        if (
            j === options.sectionLength ||
            (i > 0 && words[i - 1].match(/^\w+\.\s?$/))
        ) {
            sections.push({
                count: j,
                html: `<span class="word">${section}</span>`,
                paragraph: paragraphIndex,
            })
            section = ''
            j = 0
        }
        const newLineClass = j === options.sectionLength - 1 ? 'new-line' : ''
        const newParagraphClass = i === words.length - 1 ? 'new-paragraph' : ''
        section += ` </span><span class="word ${newLineClass} ${newParagraphClass}" id="${j}">${words[i]}`
    }
    sections.push({
        count: j,
        html: `<span class="paragraph">${section}</span>`,
        paragraph: paragraphIndex,
    })
    return sections
}

main()
