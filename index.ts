import { conjunctions } from "./dictionary/conjunctions"
import { prepositions } from "./dictionary/prepositions"

const main = () => {
    const div = document.getElementById('text')
    if (!div) return
    const text = div.innerText

    const parsed = parse(text)
    div.innerHTML = parsed

}

const punctuation = ['.', ',']

function parse(str: string): string {
    let startIndex = 0
    let currentWord = ''
    let punctMark = ''
    let newScentence = true
    let firstWord = true

    for (let i = 0; i < str.length; i++) {
        const char = str[i]
        const isPunctuation = punctuation.includes(char)

        if (char === ' ' || isPunctuation) {
            if (isPunctuation) {
                punctMark = char
            }
            const wordClass = getWordClass(currentWord)

            // if (currentWord && currentWord !== ' ' && newScentence) {
            //     if (newScentence) console.log(currentWord)
            //     const firstChar = currentWord.at(-0) ?? ''
            //     const addition = `<span class='hl-new-scentence'> ${firstChar}</span>`
            //     str = str.slice(0, startIndex) + addition + str.slice(startIndex + (1 + (firstWord ? 0 : 1)))
            //     i += addition.length
            //     startIndex = i
            //     currentWord = currentWord.slice(1)
            //     newScentence = false
            // }


            if (wordClass) {
                const { string, insertLength } = highlightText(str, currentWord, startIndex, wordClass)
                str = string
                i += insertLength - currentWord.length - 1
            }

            startIndex = i
            if (isPunctuation) {
                const { string, insertLength } = highlightText(str, punctMark, startIndex, 'punctuation')
                str = string
                i += insertLength - currentWord.length - 1
                if (punctMark === '.') newScentence = true
            }


            startIndex += 1
            currentWord = ''
            firstWord = false
            punctMark = ''
            continue
        }
        currentWord += char
    }
    return str
}

function getWordClass(word: string) {
    if (conjunctions.includes(word)) return 'conjunction'
    if (prepositions.includes(word)) return 'preposition'
    return null
}

function highlightText(str: string, word: string, startIndex: number, highlightClass: string) {
    const highlight = `<span class='hl-${highlightClass}'>${word}</span>`
    return {
        string: str.slice(0, startIndex) + highlight + str.slice(startIndex + word.length),
        insertLength: highlight.length
    }
}

main()
