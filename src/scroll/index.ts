import { assignDefaults, options } from './data'
import { createLayout } from './layout'
import { loop } from './loop'
import { Line } from './types'
import { initialiseUserInput } from './userInput'

const main = () => {
    // for local version only do not use in extension
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
    initialiseUserInput()
    loop(lines, paragraphs)
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
                html: `<span class="lexia-word">${section}</span>`,
                paragraph: paragraphIndex,
            })
            section = ''
            j = 0
        }
        const newLineClass =
            j === options.sectionLength - 1 ? 'lexia-new-line' : ''
        const newParagraphClass =
            i === words.length - 1 ? 'lexia-new-paragraph' : ''
        section += ` </span><span class="lexia-word ${newLineClass} ${newParagraphClass}" id="${j}">${words[i]}`
    }
    sections.push({
        count: j,
        html: `<span class="lexia-paragraph">${section}</span>`,
        paragraph: paragraphIndex,
    })
    return sections
}

main()
