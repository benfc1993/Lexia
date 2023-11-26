export function camelToScentence(str: string) {
    let string = str[0].toUpperCase()
    for (const char of str.slice(1)) {
        if (char.match(/[A-Z]/)) {
            string += ' '
        }
        string += char
    }

    return string
}
