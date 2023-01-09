/**
 * Splits a string by a given character (default ','). Escaped characters (characters
 * preceded by a backslash) will not apply to the split, and the backslash will be
 * removed in the array element. Inverse of `joinWith`.
 *
 * @example
 * splitBy('this\\,\\,that,,the other,,,\\,')
 * // or
 * splitBy('this\\,\\,that,,the other,,,\\,', ',')
 * // would return
 * ['this,,that', '', 'the other', '', '', ',']
 */
export declare const splitBy: (str?: string, splitChar?: string) => string[];
/**
 * Joins an array of strings using the given character (default ','). When the given
 * character appears in an array element, a backslash will be added just before it to
 * distinguish it from the join character. Inverse of `splitBy`.
 *
 * @example
 * joinWith(['this,,that', '', 'the other', '', '', ','])
 * // would return
 * 'this\\,\\,that,,the other,,,\\,'
 */
export declare const joinWith: (strArr: (string | undefined | null)[], joinChar?: string) => string;
/**
 * Trims the value if it is a string. Otherwise returns value as-is.
 */
export declare const trimIfString: (val: any) => any;
/**
 * Splits strings by comma and trims each element; returns arrays as-is.
 */
export declare const toArray: (v: any) => any[];
export declare const nullFreeArray: <T>(arr: T[]) => arr is Exclude<T, null>[];
