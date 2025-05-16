export const sortWithNullableValues = (a?: string, b?: string): number => {
    // put `null` values at the end
    if (!a) {
        return 1;
    }
    if (!b) {
        return -1;
    }
    return a.localeCompare(b);
};
