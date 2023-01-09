/**
 * Generates a valid v4 UUID, i.e. matching this regex:
 *
 *     /^[0-9A-F]{8}-[0-9A-F]{4}-[4][0-9A-F]{3}-[89AB][0-9A-F]{3}-[0-9A-F]{12}$/i
 *
 * @returns Valid v4 UUID
 */
export declare let generateID: () => string;
