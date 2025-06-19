export function generateRandomId(): string {
    const timestamp = Date.now();
    const randomSuffix = Math.floor(Math.random() * 10000);
    return [timestamp.toString(), randomSuffix].join('').slice(-8);
}

export function formatTimestamp(input: string): string {
    const date = new Date(input);
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0'); // Months are 0-indexed
    const year = String(date.getFullYear());
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    const seconds = String(date.getSeconds()).padStart(2, '0');

    return `${day}${month}${year}${hours}${minutes}${seconds}`;
}
