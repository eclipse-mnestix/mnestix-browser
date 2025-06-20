export function generateRandomId(): string {
    const timestamp = Date.now();
    const randomSuffix = Math.floor(Math.random() * 10000);
    return [timestamp.toString(), randomSuffix].join('').slice(-8);
}
