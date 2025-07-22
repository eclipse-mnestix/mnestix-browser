export const sortWithNullableValues = (a?: string, b?: string): number => {
    // put `undefined` values at the end
    if (a === undefined) {
        return 1;
    }
    if (b === undefined) {
        return -1;
    }
    return a.localeCompare(b);
};
