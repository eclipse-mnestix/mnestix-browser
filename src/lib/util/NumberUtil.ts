export function cutDecimalPlaces(number: number, maxDecimalPlaces: number) {
    const factor = Math.pow(10, maxDecimalPlaces);
    return Math.round(number * factor) / factor;
}

export function stringToFloat(value: string, defaultValue: number = 0): number {
    const rawValue = value ? value.replace(',', '.') : '0';
    const parsedValue = parseFloat(rawValue);
    return isNaN(parsedValue) ? defaultValue : parsedValue;
}
