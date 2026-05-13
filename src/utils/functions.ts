export const isNonEmptyArray = (array: any): boolean => {
    return Array.isArray(array) && array.length > 0;
};