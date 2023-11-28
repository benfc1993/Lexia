import { createSelectionNotification } from './layout'
import { onParentSelection } from './parse'

export function startSelection() {
    document.addEventListener('mouseover', hoverElements)
    createSelectionNotification()
    document.addEventListener('keydown', quitSelection)
}

function quitSelection(e: KeyboardEvent) {
    if (e.key !== 'Escape') return
    document.removeEventListener('mouseover', hoverElements)
    const highlighted = document.getElementsByClassName('lexia-selection')
    for (const el of highlighted) el.classList.remove('lexia-selection')
    document.getElementsByClassName('lexia-selection-notification')[0].remove()
}

function elementClick(e: MouseEvent) {
    const el = e.target as HTMLElement
    el.removeEventListener('click', elementClick)
    document.removeEventListener('mouseover', hoverElements)
    onParentSelection(el)
}

function hoverElements(e: MouseEvent) {
    const el = e.target as HTMLElement
    if (el.hasAttribute('lexia')) return
    el.classList.add('lexia-selection')
    el.addEventListener('mouseout', leaveElement)
    el.addEventListener('click', elementClick)
}
function leaveElement(e: MouseEvent) {
    const hoveredEl = e.target as HTMLElement
    hoveredEl.classList.remove('lexia-selection')
    hoveredEl.removeEventListener('click', elementClick)
    hoveredEl.removeEventListener('mouseout', leaveElement)
}
