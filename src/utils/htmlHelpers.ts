export function eventValue(e: Event) {
    return (e.target as HTMLInputElement).value
}
export function eventChecked(e: Event) {
    return (e.target as HTMLInputElement).checked
}
