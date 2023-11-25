const main = () => {
    const startScrollButton = document.getElementById('scroll')
    if (!startScrollButton) return
    startScrollButton.onclick = (e: MouseEvent) => {
        e.preventDefault()
        scroll()
    }
}

type Section = {
    count: number
    html: string
}
let paused = false
const options = {
    wps: 9,
    commaRest: 100,
    fullStopRest: 250,
    newLineRest: 50,
    sectionLength: 8,
}

export const scroll = () => {
    createLayout()
    document.addEventListener('keydown', (e: KeyboardEvent) => {
        console.log(e.key)
        if (e.key === ' ') {
            e.preventDefault()
            paused = !paused
            document
                .getElementById('lexia-scroll-pause')
                ?.classList.toggle('show')
        }
    })

    const tags = document.getElementsByTagName('p')
    if (!tags) return
    const paragraphs: { count: number; html: string }[] = []

    for (const tag of tags) {
        const sections = splitWords(tag.innerText)
        paragraphs.push(...sections)
    }
    ticker(paragraphs)
}

function createLayout() {
    const overlay = document.createElement('div')
    overlay.classList.add('scroll-overlay')

    const container = document.createElement('div')
    container.classList.add('scroll-container')
    overlay.appendChild(container)

    const slide = document.createElement('div')
    slide.classList.add('scroll-slide')
    container.appendChild(slide)

    const pause = document.createElement('div')
    pause.classList.add('pause')
    pause.id = 'lexia-scroll-pause'
    overlay.appendChild(pause)

    document.body.appendChild(overlay)
}

function ticker(paragraphs: Section[]) {
    const scrollContainer = document.getElementsByClassName('scroll-slide')[0]
    const scrollSlide = document.getElementsByClassName(
        'scroll-slide',
    )[0] as HTMLElement
    if (!scrollContainer || !scrollSlide) return

    scrollContainer.innerHTML = paragraphs[0].html

    let currentParagraph = 0
    let currentWord = 0
    let nextUpdateTime = Date.now()

    const interval = setInterval(() => {
        if (!paused && Date.now() >= nextUpdateTime) {
            if (currentParagraph >= paragraphs.length) {
                clearInterval(interval)
            } else if (currentWord >= paragraphs[currentParagraph].count) {
                nextUpdateTime += options.newLineRest
                currentParagraph++
                currentWord = 0
                scrollContainer.innerHTML = paragraphs[currentParagraph].html
                const current = document.getElementById(
                    currentWord.toString(),
                ) as HTMLElement
                current.classList.add('scroll-highlight')
            } else {
                const { current, next } = scrollWords(currentWord)
                currentWord = current
                nextUpdateTime = next
            }
        }
    })
}

function scrollWords(currentWord: number) {
    document
        .getElementById((currentWord - 2).toString())
        ?.classList.remove('scroll-highlight-post')
    document
        .getElementById((currentWord - 1).toString())
        ?.classList.replace('scroll-highlight', 'scroll-highlight-post')
    const nextEl = document.getElementById((currentWord + 1).toString())
    nextEl?.classList.add('scroll-highlight-pre')

    const current = document.getElementById(
        currentWord.toString(),
    ) as HTMLElement
    current?.classList.replace('scroll-highlight-pre', 'scroll-highlight')
    let next =
        Date.now() + 1000 / options.wps + (current.innerText.length - 6) * 10
    if (!nextEl) {
        next += 50
    }

    if (current.innerText.match(/^\w+[\,\;][\s\'\"“”]?\s?$/))
        next += options.commaRest

    if (current.innerText.match(/^\w+\.[\s\'\"“”]?\s?$/))
        next += options.fullStopRest

    return { current: currentWord + 1, next }
}

function splitWords(str: string): Section[] {
    const sections: Section[] = []
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
            })
            section = ''
            j = 0
        }
        section += ` </span><span class="word" id="${j}">${words[i]}`
    }
    sections.push({ count: j, html: `<span class="word">${section}</span>` })
    return sections
}

main()
