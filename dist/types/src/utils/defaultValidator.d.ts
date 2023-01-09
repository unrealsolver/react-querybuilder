import type { QueryValidator } from '@react-querybuilder/ts/src/index.noReact';
/**
 * This is an example validation function you can pass to QueryBuilder in the
 * `validator` prop. It assumes that you want to validate groups, and has a no-op
 * for validating rules which you should replace with your own implementation.
 */
export declare const defaultValidator: QueryValidator;
