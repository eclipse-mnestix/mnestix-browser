export function isValidUrl(urlString: string | null | undefined): boolean {
    if (!urlString) return false;

    let url;
    try {
        url = new URL(urlString);
    } catch {
        return false;
    }
    return url.protocol === 'http:' || url.protocol === 'https:';
}
