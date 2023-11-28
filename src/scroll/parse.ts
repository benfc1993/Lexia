import { AsyncStorage, Storage } from '../storage/types'
import { assignDefaults, options, setStorageMethod } from './data'
import { createLayout } from './layout'
import { loop } from './loop'
import { ticker } from './ticker'
import type { Line } from './types'
import { initialiseUserInput } from './userInput'

export function quit() {
    ticker.end()
    const overlay = document.getElementById('lexia-scroll-overlay')
    if (overlay) overlay.remove()
}
export const startScroll = async (storage: Storage | AsyncStorage) => {
    setStorageMethod(storage)
    await assignDefaults()
    createLayout()
    const { lines, paragraphs } = parse()

    initialiseUserInput()
    loop(lines, paragraphs)
}

export function parse() {
    console.log(options.sectionLength)
    const tags = document.getElementsByTagName('p')
    if (!tags) return { lines: [], paragraphs: [] }
    const lines: Line[] = []
    let paragraphIndex = 0
    let paragraphs: number[] = []
    let wordIndex = 0

    for (const tag of tags) {
        const { wordCount, sections } = splitWords(
            wordIndex,
            paragraphs.length,
            tag.innerText,
        )
        paragraphs.push(paragraphIndex)
        lines.push(...sections)
        wordIndex += wordCount
        paragraphIndex += sections.length
    }

    return { lines, paragraphs }
}

function splitWords(
    wordIndex: number,
    paragraphIndex: number,
    str: string,
): { wordCount: number; sections: Line[] } {
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
            j === options.sectionLength.value ||
            (i > 0 && words[i - 1].match(/^\w+\.\s?$/))
        ) {
            sections.push({
                count: j,
                wordCountStart: wordIndex + i,
                html: `${section}</span>`,
                paragraph: paragraphIndex,
            })
            section = ''
            j = 0
        }
        const newLineClass =
            j === options.sectionLength.value - 1 ? 'lexia-new-line' : ''
        const newParagraphClass =
            i === words.length - 1 ? 'lexia-new-paragraph' : ''
        section += ` </span><span class="lexia-word ${newLineClass} ${newParagraphClass}" id="lexia-word-${j}">${words[i]}`
    }
    sections.push({
        count: j,
        wordCountStart: wordIndex + words.length - j,
        html: `<span class="lexia-paragraph">${section}</span></span>`,
        paragraph: paragraphIndex,
    })
    return { wordCount: words.length, sections }
}
