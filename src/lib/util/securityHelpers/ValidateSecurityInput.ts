const DANGEROUS_HEADERS = ['Authorization', 'Host', 'Content-Length', 'Cookie', 'Set-Cookie'] as const;

export const VALIDATION_ERROR_KEYS = {
    HEADER_KEY_DANGEROUS: 'form.headerKeyDangerous',
    HEADER_KEY_INVALID_FORMAT: 'form.headerKeyInvalidFormat',
    HEADER_KEY_CRLF_NOT_ALLOWED: 'form.headerKeyCrLfNotAllowed',
    HEADER_VALUE_TOO_LONG: 'form.headerValueTooLong',
    HEADER_VALUE_CRLF_NOT_ALLOWED: 'form.headerValueCrLfNotAllowed',
    HEADER_VALUE_ILLEGAL_CHARS: 'form.headerValueIllegalChars',
} as const;

export type ValidationErrorKey = (typeof VALIDATION_ERROR_KEYS)[keyof typeof VALIDATION_ERROR_KEYS];

function isDangerousHeader(key: string) {
    return (DANGEROUS_HEADERS as readonly string[]).includes(key);
}

export interface ValidationResult {
    isValid: boolean;
    errorKey?: ValidationErrorKey;
}

export function validateHeaderKey(key: string): ValidationResult {
    if (isDangerousHeader(key)) {
        return { isValid: false, errorKey: VALIDATION_ERROR_KEYS.HEADER_KEY_DANGEROUS };
    }

    if (!/^[A-Za-z0-9-_]+$/.test(key)) {
        return { isValid: false, errorKey: VALIDATION_ERROR_KEYS.HEADER_KEY_INVALID_FORMAT };
    }

    if (/[\r\n]/.test(key)) {
        return { isValid: false, errorKey: VALIDATION_ERROR_KEYS.HEADER_KEY_CRLF_NOT_ALLOWED };
    }

    return { isValid: true };
}

export function validateHeaderValue(value: string): ValidationResult {
    if (value.length > 10000) {
        return { isValid: false, errorKey: VALIDATION_ERROR_KEYS.HEADER_VALUE_TOO_LONG };
    }

    if (/[\r\n]/.test(value)) {
        return { isValid: false, errorKey: VALIDATION_ERROR_KEYS.HEADER_VALUE_CRLF_NOT_ALLOWED };
    }

    if (/[;'"]|--/.test(value)) {
        return { isValid: false, errorKey: VALIDATION_ERROR_KEYS.HEADER_VALUE_ILLEGAL_CHARS };
    }

    return { isValid: true };
}
