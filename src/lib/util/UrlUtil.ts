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

/**
 * Encodes an AAS idShort path for use in URL path segments.
 * Percent-encodes characters like `[` and `]` that appear in list indices
 * (e.g. `Documents[1].DocumentVersions[0]`) while preserving dots and
 * other unreserved characters.
 */
export function encodeIdShortPath(idShortPath: string): string {
    return idShortPath.replace(/\[/g, '%5B').replace(/\]/g, '%5D');
}
