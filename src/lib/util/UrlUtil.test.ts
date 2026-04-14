import { encodeIdShortPath, isValidUrl } from 'lib/util/UrlUtil';

describe('UrlUtil', () => {
    describe('encodeIdShortPath', () => {
        it('should encode square brackets in idShort paths', () => {
            const path = 'Documents[1].DocumentVersions[0].DigitalFiles[0]';
            expect(encodeIdShortPath(path)).toBe('Documents%5B1%5D.DocumentVersions%5B0%5D.DigitalFiles%5B0%5D');
        });

        it('should return path unchanged when no brackets are present', () => {
            const path = 'SubmodelElement.ChildElement';
            expect(encodeIdShortPath(path)).toBe('SubmodelElement.ChildElement');
        });

        it('should handle a single bracket pair', () => {
            const path = 'Items[0]';
            expect(encodeIdShortPath(path)).toBe('Items%5B0%5D');
        });

        it('should handle empty string', () => {
            expect(encodeIdShortPath('')).toBe('');
        });
    });

    describe('isValidUrl', () => {
        it('should return true for valid http URLs', () => {
            expect(isValidUrl('http://example.com')).toBe(true);
        });

        it('should return true for valid https URLs', () => {
            expect(isValidUrl('https://example.com')).toBe(true);
        });

        it('should return false for null', () => {
            expect(isValidUrl(null)).toBe(false);
        });

        it('should return false for non-URL strings', () => {
            expect(isValidUrl('not-a-url')).toBe(false);
        });
    });
});
