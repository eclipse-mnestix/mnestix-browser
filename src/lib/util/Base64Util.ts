import { Buffer } from 'buffer';

export function encodeBase64(str: string): string {
    return Base64EncodeUrl(Buffer.from(str).toString('base64'));
}

/**
 * Safely decodes a base64-encoded string provided by the user.
 *
 * @param {string} str - The base64-encoded string to be decoded.
 * @returns {string} - The decoded string from the base64 input.
 * @throws {Error} - If the input contains invalid characters, exceeds the maximum allowed length, or if the decoding process fails.
 */
export function safeBase64Decode(str: string): string {
    const base64Pattern = /^[A-Za-z0-9_-]+$/; //RFC 4648 - The Base64Url Alphabet
    const maxLength = 1000; // this is assumption only max. 1000 characters

    if (!base64Pattern.test(str)) {
        throw new Error(`Invalid base64 (${str}) input`);
    }

    if (str.length > maxLength) {
        throw new Error('Input too long');
    }

    try {
        return Buffer.from(str, 'base64').toString();
    } catch {
        throw new Error('Failed to decode base64 input');
    }
}

export async function blobToBase64(blob: Blob): Promise<string> {
    const arrayBuffer = await blob.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    return buffer.toString('base64');
}

export function base64ToBlob(base64: string, blobType: string): Blob {
    const bytesCharacters = atob(base64);
    const byteNumbers = new Array(bytesCharacters.length);
    for (let i = 0; i < bytesCharacters.length; i++) {
        byteNumbers[i] = bytesCharacters.charCodeAt(i);
    }
    const byteArray = new Uint8Array(byteNumbers);
    return new Blob([byteArray], { type: blobType });
}

/**
 * use this to make a Base64 encoded string URL friendly,
 * i.e. '+' and '/' are replaced with '-' and '_' also any trailing '='
 * characters are removed
 *
 * @param {String} str the encoded string
 * @returns {String} the URL friendly encoded String
 */
function Base64EncodeUrl(str: string) {
    return str.replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
}
