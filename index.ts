import { conjunctions } from "./dictionary/conjunctions"
import { prepositions } from "./dictionary/prepositions"


enum HlClass {
    None = '',
    NewLine = 'newline',
    First = 'first',
    Conjunction = 'conjunction',
    Preposition = 'preposition',
    Punctuation = 'punctuation',
    Center = 'center'
}
const base: Map<Element, string> = new Map()
const main = () => {
    const div = document.getElementById('text')
    if (!div) return
    for (const child of div.children) {
        base.set(child, child.textContent ?? '')
    }
}

window.onload = function() {
    const div = document.getElementById('text')

    if (!div) return

    for (const child of div.children)
        lexer(child, child.innerHTML.toString()!)
}

window.render = function() {

    const div = document.getElementById('text')
    if (!div) return



    for (const child of div.children) {
        if ((document.getElementById('show-highlights') as HTMLInputElement).checked) {
            const tokens = tokensMap.get(child)
            if (!tokens) continue
            const parsed = parser(tokens)
            child.innerHTML = parsed
        } else {
            child.innerHTML = base.get(child) ?? ''
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
        const fullWord = word.replace(/[\.,\s\n]/g, '').replace(/\<.*\>/g, '').replace(/\<\/.*\>/g, '')
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
            hasChildren() { return Object.hasOwn(this, 'children') }
        }

        if (punctuation.includes(word.at(-1) ?? '')) {
            wordToken.children.push(createToken(
                HlClass.Punctuation,
                word.at(-1) as string,
                word.length - 1,
                wordToken.scentanceStart,
            ))
        }

        wordToken.children.push(createToken(
            HlClass.First,
            currentWord.slice(0, 1),
            0,
            wordToken.scentanceStart,
        ))

        if (fullWord.length > 8) {
            wordToken.children.push(createToken(
                HlClass.Center,
                currentWord.slice(2, -2),
                2,
                wordToken.scentanceStart,
            ))
        }
        elementTokens.push(wordToken)

        if (idx > 0 && idx % lineLength === 0) elementTokens.push(createToken(HlClass.NewLine, '</br>', 0, false))
        idx++
    }
    tokensMap.set(element, elementTokens)

}

function createToken(type: HlClass, text: string, position: number, scentanceStart: boolean) {
    return {
        type,
        text,
        position,
        scentanceStart,
        hasChildren() { return false }
    }
}
function parser(tokens: Token[]) {
    let lineIndex = 0
    const test = tokens.map((token, idx) => {
        const highlights: string[] = []
        if (token.type === HlClass.NewLine) {
            console.log('newline')
            highlights.push(`</span>`)
            highlights.push(token.text)
            if (idx !== tokens.length - 1) {
                const prevLineIdx = lineIndex
                lineIndex++
                lineIndex %= 4
                highlights.push(`<span class='line b-start b-start-${prevLineIdx} b-line b-line-${lineIndex}'>`)
            }
            return highlights.join('')
        }
        if (!token.hasChildren()) return highlightWrap(token.text, token.type)
        const children = token.children!.sort((a, b) => a.position - b.position)

        let remainder = token.text
        for (const child of children) {
            if (child.type !== HlClass.None && !(document.getElementById('hl-' + child.type) as HTMLInputElement)!.checked) {
                continue
            }

            const offsetChildPosition = child.position - (token.text.length - remainder.length)
            const before = remainder.slice(0, offsetChildPosition)
            const hl = highlightWrap(remainder.slice(offsetChildPosition, offsetChildPosition + child.text.length), child.type)
            remainder = remainder.slice(offsetChildPosition + child.text.length)
            if (before.length) highlights.push(before)
            highlights.push(hl)
        }

        if (remainder.length) highlights.push(remainder)
        const finalText = highlights.join('')
        const result = (idx === 0 ? `<span class='line b-line b-line-${lineIndex}'>` : '') + (token.type === HlClass.None ||
            !(document.getElementById('hl-' + token.type) as HTMLInputElement)!.checked ? finalText :
            highlightWrap(finalText, token.type))
        console.log(result)
        return result
    }).join(' ')
    console.log(test)
    return test


}

function highlightWrap(string: string, hlClass: string) {
    return `<span class='hl-${hlClass}'>${string}</span>`

}

function getWordClass(word: string) {
    if (conjunctions.includes(word)) return HlClass.Conjunction
    if (prepositions.includes(word)) return HlClass.Preposition
    return HlClass.None
}

main()
