import { conjunctions } from './dictionary/conjunctions'
import { prepositions } from './dictionary/prepositions'
import { storage } from './storage/sync'

enum HlClass {
    None = '',
    NewLine = 'newline',
    First = 'first',
    Conjunction = 'conj',
    Preposition = 'prep',
    Punctuation = 'punc',
    Center = 'center'
}
export type Options = Record<Exclude<HlClass, '' | 'newline'>, boolean> & {
    highlight: boolean
}

let options: Options = {
    highlight: false,
    punc: false,
    first: false,
    center: false,
    conj: false,
    prep: false
}
const optionStorage = storage()
const main = async () => {
    await optionStorage
        .get<Options>('', {
            highlight: false,
            punc: false,
            first: false,
            center: false,
            conj: false,
            prep: false
        })
        .then((items) => Object.assign(options, items))
    const div = [...document.getElementsByTagName('p')].filter(
        (el) => !el.classList.contains('lexia-line')
    )

    if (!div) return

    const lexiaElements = document.getElementsByClassName('lexia-text')
    for (let i = lexiaElements.length - 1; i >= 0; i--) {
        const el = lexiaElements[i]
        el.remove()
    }
    for (const el of document.getElementsByClassName('lexia-hide')) {
        el.classList.remove('lexia-hide')
    }
    if (options.highlight) {
        for (const tag of div) {
            const newTag = document.createElement('div')
            newTag.classList.add('lexia-text')
            tag.parentNode?.insertBefore(newTag, tag)
            tag.classList.add('lexia-hide')

            if (tag.tagName === 'style' || tag.tagName === 'script') continue
            lexer(tag, tag.outerHTML.toString()!)
            const tokens = tokensMap.get(tag)
            if (!tokens) return
            const parsed = parser(tokens)
            newTag.innerHTML = parsed
        }
    }
}

type Token = {
    text: string
    type: HlClass
    scentanceStart: boolean
    position: number
    children?: Token[]
    hasChildren: () => boolean
}

const punctuation = ['.', ',']
const htmlRegex = /^<\/*[a-z]+(?![^>]*\/>)[^>]*>$/
const lineLength = 12
const tokensMap: Map<Element, Token[]> = new Map()

function lexer(element: Element, str: string) {
    const words = str.trim().split(/<\/*[a-z]+(?![^>]*\/>)[^>]*>|\s/)
    const elementTokens: Token[] = []
    let idx = 0
    for (const word of words) {
        if (word.length === 0) continue
        const fullWord = word
            .replace(/[\.,\s\n]/g, '')
            .replace(/\<.*\>/g, '')
            .replace(/\<\/.*\>/g, '')
        let currentWord = fullWord

        if (word.match(htmlRegex)) {
            elementTokens.push({
                type: HlClass.None,
                text: word,
                position: 0,
                hasChildren: () => false,
                scentanceStart: false
            })
            continue
        }

        const wordToken: Token & { children: Token[] } = {
            type: getWordClass(fullWord),
            text: word,
            scentanceStart: false,
            position: 0,
            children: [],
            hasChildren() {
                return Object.hasOwn(this, 'children')
            }
        }

        if (punctuation.includes(word.at(-1) ?? '')) {
            wordToken.children.push(
                createToken(
                    HlClass.Punctuation,
                    word.at(-1) as string,
                    word.length - 1,
                    wordToken.scentanceStart
                )
            )
        }

        wordToken.children.push(
            createToken(
                HlClass.First,
                currentWord.slice(0, 1),
                0,
                wordToken.scentanceStart
            )
        )

        if (fullWord.length > 8) {
            wordToken.children.push(
                createToken(
                    HlClass.Center,
                    currentWord.slice(2, -2),
                    2,
                    wordToken.scentanceStart
                )
            )
        }
        elementTokens.push(wordToken)

        if (idx > 0 && idx % lineLength === 0)
            elementTokens.push(createToken(HlClass.NewLine, '', 0, false))
        idx++
    }
    tokensMap.set(element, elementTokens)
}

function createToken(
    type: HlClass,
    text: string,
    position: number,
    scentanceStart: boolean
) {
    return {
        type,
        text,
        position,
        scentanceStart,
        hasChildren() {
            return false
        }
    }
}
function parser(tokens: Token[]) {
    let lineIndex = 0
    return tokens
        .map((token, idx) => {
            const highlights: string[] = []
            if (token.type === HlClass.NewLine) {
                highlights.push(`</p>`)
                highlights.push(token.text)
                if (idx !== tokens.length - 1) {
                    const prevLineIdx = lineIndex
                    lineIndex++
                    lineIndex %= 4
                    highlights.push(
                        `<p class='lexia-line b-start b-start-${prevLineIdx} b-lexia-line b-lexia-line-${lineIndex}'>`
                    )
                }
                return highlights.join('')
            }
            if (!token.hasChildren())
                return highlightWrap(token.text, token.type)
            const children = token.children!.sort(
                (a, b) => a.position - b.position
            )

            let remainder = token.text
            for (const child of children) {
                if (
                    child.type !== HlClass.None &&
                    !options[child.type as keyof typeof options]
                ) {
                    continue
                }

                const offsetChildPosition =
                    child.position - (token.text.length - remainder.length)
                const before = remainder.slice(0, offsetChildPosition)
                const hl = highlightWrap(
                    remainder.slice(
                        offsetChildPosition,
                        offsetChildPosition + child.text.length
                    ),
                    child.type
                )
                remainder = remainder.slice(
                    offsetChildPosition + child.text.length
                )
                if (before.length) highlights.push(before)
                highlights.push(hl)
            }

            if (remainder.length) highlights.push(remainder)
            const finalText = highlights.join('')
            return (
                (idx === 0
                    ? `<p class='lexia-line b-lexia-line b-lexia-line-${lineIndex}'>`
                    : '') +
                (token.type === HlClass.None || !options[token.type]
                    ? finalText
                    : highlightWrap(finalText, token.type))
            )
        })
        .join(' ')
}

function highlightWrap(string: string, hlClass: string) {
    return `<span class='hl-${hlClass}'>${string}</span>`
}

function getWordClass(word: string) {
    if (conjunctions.includes(word)) return HlClass.Conjunction
    if (prepositions.includes(word)) return HlClass.Preposition
    return HlClass.None
}

function setColors() {
    const root = document.querySelector(':root')! as HTMLElement
    root.style.setProperty('--center', '#222')
}
main()
setColors()
