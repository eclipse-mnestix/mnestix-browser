import {
    validateHeaderKey,
    validateHeaderValue,
    VALIDATION_ERROR_KEYS,
    ValidationResult,
} from './ValidateSecurityInput';

describe('ValidateSecurityInput', () => {
    describe('validateHeaderKey', () => {
        describe('dangerous headers', () => {
            it('should reject Authorization header', () => {
                const result = validateHeaderKey('Authorization');
                expect(result).toEqual({
                    isValid: false,
                    errorKey: VALIDATION_ERROR_KEYS.HEADER_KEY_DANGEROUS,
                });
            });

            it('should reject Host header', () => {
                const result = validateHeaderKey('Host');
                expect(result).toEqual({
                    isValid: false,
                    errorKey: VALIDATION_ERROR_KEYS.HEADER_KEY_DANGEROUS,
                });
            });

            it('should reject Content-Length header', () => {
                const result = validateHeaderKey('Content-Length');
                expect(result).toEqual({
                    isValid: false,
                    errorKey: VALIDATION_ERROR_KEYS.HEADER_KEY_DANGEROUS,
                });
            });

            it('should reject Cookie header', () => {
                const result = validateHeaderKey('Cookie');
                expect(result).toEqual({
                    isValid: false,
                    errorKey: VALIDATION_ERROR_KEYS.HEADER_KEY_DANGEROUS,
                });
            });

            it('should reject Set-Cookie header', () => {
                const result = validateHeaderKey('Set-Cookie');
                expect(result).toEqual({
                    isValid: false,
                    errorKey: VALIDATION_ERROR_KEYS.HEADER_KEY_DANGEROUS,
                });
            });
        });

        describe('invalid format', () => {
            it('should reject header key with spaces', () => {
                const result = validateHeaderKey('Custom Header');
                expect(result).toEqual({
                    isValid: false,
                    errorKey: VALIDATION_ERROR_KEYS.HEADER_KEY_INVALID_FORMAT,
                });
            });

            it('should reject header key with special characters', () => {
                const result = validateHeaderKey('Custom@Header');
                expect(result).toEqual({
                    isValid: false,
                    errorKey: VALIDATION_ERROR_KEYS.HEADER_KEY_INVALID_FORMAT,
                });
            });

            it('should reject header key with dots', () => {
                const result = validateHeaderKey('Custom.Header');
                expect(result).toEqual({
                    isValid: false,
                    errorKey: VALIDATION_ERROR_KEYS.HEADER_KEY_INVALID_FORMAT,
                });
            });

            it('should reject empty header key', () => {
                const result = validateHeaderKey('');
                expect(result).toEqual({
                    isValid: false,
                    errorKey: VALIDATION_ERROR_KEYS.HEADER_KEY_INVALID_FORMAT,
                });
            });
        });

        describe('valid header keys', () => {
            it('should accept valid alphanumeric header key', () => {
                const result = validateHeaderKey('CustomHeader123');
                expect(result).toEqual({ isValid: true });
            });

            it('should accept header key with hyphens', () => {
                const result = validateHeaderKey('Custom-Header');
                expect(result).toEqual({ isValid: true });
            });

            it('should accept header key with underscores', () => {
                const result = validateHeaderKey('Custom_Header');
                expect(result).toEqual({ isValid: true });
            });

            it('should accept mixed case header key', () => {
                const result = validateHeaderKey('X-API-KEY');
                expect(result).toEqual({ isValid: true });
            });

            it('should accept single character header key', () => {
                const result = validateHeaderKey('X');
                expect(result).toEqual({ isValid: true });
            });
        });
    });

    describe('validateHeaderValue', () => {
        describe('length validation', () => {
            it('should reject header value that is too long', () => {
                const longValue = 'a'.repeat(10001);
                const result = validateHeaderValue(longValue);
                expect(result).toEqual({
                    isValid: false,
                    errorKey: VALIDATION_ERROR_KEYS.HEADER_VALUE_TOO_LONG,
                });
            });

            it('should accept header value at maximum length', () => {
                const maxLengthValue = 'a'.repeat(10000);
                const result = validateHeaderValue(maxLengthValue);
                expect(result).toEqual({ isValid: true });
            });
        });

        describe('CRLF injection prevention', () => {
            it('should reject header value with carriage return', () => {
                const result = validateHeaderValue('value\rwith\rCR');
                expect(result).toEqual({
                    isValid: false,
                    errorKey: VALIDATION_ERROR_KEYS.HEADER_VALUE_CRLF_NOT_ALLOWED,
                });
            });

            it('should reject header value with line feed', () => {
                const result = validateHeaderValue('value\nwith\nLF');
                expect(result).toEqual({
                    isValid: false,
                    errorKey: VALIDATION_ERROR_KEYS.HEADER_VALUE_CRLF_NOT_ALLOWED,
                });
            });

            it('should reject header value with CRLF sequence', () => {
                const result = validateHeaderValue('value\r\nwith\r\nCRLF');
                expect(result).toEqual({
                    isValid: false,
                    errorKey: VALIDATION_ERROR_KEYS.HEADER_VALUE_CRLF_NOT_ALLOWED,
                });
            });
        });

        describe('script injection prevention', () => {
            it('should reject header value with script tag (lowercase)', () => {
                const result = validateHeaderValue('Bearer token<script>alert("xss")</script>');
                expect(result).toEqual({
                    isValid: false,
                    errorKey: VALIDATION_ERROR_KEYS.HEADER_VALUE_ILLEGAL_CHARS,
                });
            });

            it('should reject header value with script tag (uppercase)', () => {
                const result = validateHeaderValue('Bearer token<SCRIPT>alert("xss")</SCRIPT>');
                expect(result).toEqual({
                    isValid: false,
                    errorKey: VALIDATION_ERROR_KEYS.HEADER_VALUE_ILLEGAL_CHARS,
                });
            });

            it('should reject header value with javascript protocol', () => {
                const result = validateHeaderValue('javascript:alert("xss")');
                expect(result).toEqual({
                    isValid: false,
                    errorKey: VALIDATION_ERROR_KEYS.HEADER_VALUE_ILLEGAL_CHARS,
                });
            });

            it('should reject header value with vbscript protocol', () => {
                const result = validateHeaderValue('vbscript:msgbox("xss")');
                expect(result).toEqual({
                    isValid: false,
                    errorKey: VALIDATION_ERROR_KEYS.HEADER_VALUE_ILLEGAL_CHARS,
                });
            });

            it('should reject header value with onclick event handler', () => {
                const result = validateHeaderValue('onclick=alert("xss")');
                expect(result).toEqual({
                    isValid: false,
                    errorKey: VALIDATION_ERROR_KEYS.HEADER_VALUE_ILLEGAL_CHARS,
                });
            });

            it('should reject header value with onload event handler', () => {
                const result = validateHeaderValue('onload = alert("xss")');
                expect(result).toEqual({
                    isValid: false,
                    errorKey: VALIDATION_ERROR_KEYS.HEADER_VALUE_ILLEGAL_CHARS,
                });
            });
        });

        describe('control character detection', () => {
            it('should reject header value with null byte', () => {
                const result = validateHeaderValue('value\x00with\x00null');
                expect(result).toEqual({
                    isValid: false,
                    errorKey: VALIDATION_ERROR_KEYS.HEADER_VALUE_ILLEGAL_CHARS,
                });
            });

            it('should reject header value with control character \\x01', () => {
                const result = validateHeaderValue('value\x01with\x01control');
                expect(result).toEqual({
                    isValid: false,
                    errorKey: VALIDATION_ERROR_KEYS.HEADER_VALUE_ILLEGAL_CHARS,
                });
            });

            it('should reject header value with control character \\x08', () => {
                const result = validateHeaderValue('value\x08with\x08backspace');
                expect(result).toEqual({
                    isValid: false,
                    errorKey: VALIDATION_ERROR_KEYS.HEADER_VALUE_ILLEGAL_CHARS,
                });
            });

            it('should reject header value with control character \\x0B (vertical tab)', () => {
                const result = validateHeaderValue('value\x0Bwith\x0Bvtab');
                expect(result).toEqual({
                    isValid: false,
                    errorKey: VALIDATION_ERROR_KEYS.HEADER_VALUE_ILLEGAL_CHARS,
                });
            });

            it('should reject header value with control character \\x0C (form feed)', () => {
                const result = validateHeaderValue('value\x0Cwith\x0Cff');
                expect(result).toEqual({
                    isValid: false,
                    errorKey: VALIDATION_ERROR_KEYS.HEADER_VALUE_ILLEGAL_CHARS,
                });
            });

            it('should reject header value with control character \\x1F', () => {
                const result = validateHeaderValue('value\x1Fwith\x1Fcontrol');
                expect(result).toEqual({
                    isValid: false,
                    errorKey: VALIDATION_ERROR_KEYS.HEADER_VALUE_ILLEGAL_CHARS,
                });
            });

            it('should reject header value with DEL character \\x7F', () => {
                const result = validateHeaderValue('value\x7Fwith\x7Fdel');
                expect(result).toEqual({
                    isValid: false,
                    errorKey: VALIDATION_ERROR_KEYS.HEADER_VALUE_ILLEGAL_CHARS,
                });
            });

            it('should allow tab character \\x09', () => {
                const result = validateHeaderValue('value\twith\ttab');
                expect(result).toEqual({ isValid: true });
            });
        });

        describe('valid header values', () => {
            it('should accept simple bearer token', () => {
                const result = validateHeaderValue('Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9');
                expect(result).toEqual({ isValid: true });
            });

            it('should accept API key', () => {
                const result = validateHeaderValue('abc123-def456-ghi789');
                expect(result).toEqual({ isValid: true });
            });

            it('should accept empty value', () => {
                const result = validateHeaderValue('');
                expect(result).toEqual({ isValid: true });
            });

            it('should accept value with spaces', () => {
                const result = validateHeaderValue('value with spaces');
                expect(result).toEqual({ isValid: true });
            });

            it('should accept value with special characters', () => {
                const result = validateHeaderValue('value!@#$%^&*()[]{}|;:,.<>?');
                expect(result).toEqual({ isValid: true });
            });
        });

        describe('edge cases', () => {
            it('should reject multiple injection patterns in same value', () => {
                const result = validateHeaderValue('<script>alert("xss")</script>javascript:alert("more")');
                expect(result).toEqual({
                    isValid: false,
                    errorKey: VALIDATION_ERROR_KEYS.HEADER_VALUE_ILLEGAL_CHARS,
                });
            });

            it('should prioritize length validation over content validation', () => {
                const longValueWithScript = 'a'.repeat(9990) + '<script>alert("xss")</script>';
                const result = validateHeaderValue(longValueWithScript);
                expect(result).toEqual({
                    isValid: false,
                    errorKey: VALIDATION_ERROR_KEYS.HEADER_VALUE_TOO_LONG,
                });
            });

            it('should prioritize CRLF validation over injection validation', () => {
                const result = validateHeaderValue('value\nwith<script>alert("xss")</script>');
                expect(result).toEqual({
                    isValid: false,
                    errorKey: VALIDATION_ERROR_KEYS.HEADER_VALUE_CRLF_NOT_ALLOWED,
                });
            });
        });
    });

    describe('ValidationResult type', () => {
        it('should have correct structure for valid result', () => {
            const result: ValidationResult = { isValid: true };
            expect(result.isValid).toBe(true);
            expect(result.errorKey).toBeUndefined();
        });

        it('should have correct structure for invalid result', () => {
            const result: ValidationResult = {
                isValid: false,
                errorKey: VALIDATION_ERROR_KEYS.HEADER_KEY_DANGEROUS,
            };
            expect(result.isValid).toBe(false);
            expect(result.errorKey).toBe(VALIDATION_ERROR_KEYS.HEADER_KEY_DANGEROUS);
        });
    });
});
