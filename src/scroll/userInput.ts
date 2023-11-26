export function initialiseUserInput() {
    document.addEventListener(
        'keydown',
        function(e: KeyboardEvent) {
            let jump = 0
            switch (e.key) {
                case 'ArrowLeft':
                    e.preventDefault()
                    if (progress.currentLine === 0) return

                    jump = progress.currentLine - 1
                    break
                case 'ArrowRight':
                    e.preventDefault()

                    if (progress.currentLine >= lines.length - 1) return
                    jump = progress.currentLine + 1

                    break
                case 'ArrowUp': {
                    e.preventDefault()
                    const paragraphIndex = Math.max(
                        0,
                        lines[progress.currentLine].paragraph - 1,
                    )
                    jump = paragraphs[paragraphIndex]

                    break
                }
                case 'ArrowDown': {
                    e.preventDefault()
                    const paragraphIndex = Math.min(
                        lines[progress.currentLine].paragraph + 1,
                        paragraphs.length - 1,
                    )
                    jump = paragraphs[paragraphIndex]

                    break
                }
                default:
                    return
            }
            if (!paused && options.pauseOnNavigate) pause()
            setParagraph(scrollContainer, jump, lines, options.newParagraphRest)
        }.bind(progress),
    )
}
