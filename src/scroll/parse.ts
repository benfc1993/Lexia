import { AsyncStorage, Storage } from '../storage/types'
import { assignDefaults, options, setStorageMethod } from './data'
import { createLayout } from './layout'
import { loop } from './loop'
import { startSelection } from './selection'
import { ticker } from './ticker'
import type { Line } from './types'
import { initialiseUserInput, removeUserInput } from './userInput'

export function quit() {
    ticker.pTags[ticker.lines[ticker.currentLine].paragraph].scrollIntoView({
        block: 'center',
        behavior: 'smooth'
    })
    ticker.end()
    removeUserInput()
    const overlay = document.getElementById('lexia-scroll-overlay')
    if (overlay) overlay.remove()
}

export const startScroll = async (storage: Storage | AsyncStorage) => {
    setStorageMethod(storage)
    await assignDefaults()
    startSelection()
}

export function onParentSelection(parentElement: HTMLElement) {
    createLayout()
    const { lines, paragraphs, pTags } = parse(parentElement)

    initialiseUserInput()
    loop(lines, paragraphs, pTags, parentElement)
}

export function parse(selectedParent: HTMLElement) {
    let tags: NodeList | HTMLElement[] = selectedParent.querySelectorAll(
        'p, li, h1, h2, h3, h4, h5, h6, code'
    )
    if (tags.length === 0) tags = [selectedParent]
    if (!tags) return { lines: [], paragraphs: [], pTags: [] }
    const lines: Line[] = []
    let paragraphIndex = 0
    let paragraphs: number[] = []
    let pTags: HTMLElement[] = []
    let wordIndex = 0

    for (const el of tags) {
        const tag = el as HTMLElement
        const { wordCount, sections } = splitWords(
            wordIndex,
            paragraphs.length,
            tag.innerText,
            tag.tagName
        )
        paragraphs.push(paragraphIndex)
        lines.push(...sections)
        wordIndex += wordCount
        paragraphIndex += sections.length
        pTags.push(tag)
    }

    return { lines, paragraphs, pTags }
}

function splitWords(
    wordIndex: number,
    paragraphIndex: number,
    str: string,
    tagName: string
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
                html: `<span class="lexia-${tagName}">${section}</span>`,
                paragraph: paragraphIndex
            })
            section = ''
            j = 0
        }
        const newLineClass =
            j === options.sectionLength.value - 1 ? 'lexia-new-line' : ''
        const newParagraphClass =
            i === words.length - 1 ? 'lexia-new-paragraph' : ''
        section += ` ${
            j > 0 ? '</span>' : ''
        }<span class="lexia-word ${newLineClass} ${newParagraphClass}" id="lexia-word-${j}">${
            tagName === 'LI' && i === 0 ? '-' : ''
        } ${words[i]}`
    }
    sections.push({
        count: j,
        wordCountStart: wordIndex + words.length - j,
        html: `<span class="lexia-paragraph lexia-${tagName}">${section}</span></span>`,
        paragraph: paragraphIndex
    })
    return { wordCount: words.length, sections }
}
