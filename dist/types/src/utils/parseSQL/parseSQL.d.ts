import type { DefaultRuleGroupType, DefaultRuleGroupTypeIC, ParseSQLOptions } from '@react-querybuilder/ts/src/index.noReact';
/**
 * Converts a SQL `SELECT` statement into a query suitable for
 * the QueryBuilder component's `query` or `defaultQuery` props.
 */
declare function parseSQL(sql: string): DefaultRuleGroupType;
declare function parseSQL(sql: string, options: Omit<ParseSQLOptions, 'independentCombinators'> & {
    independentCombinators?: false;
}): DefaultRuleGroupType;
declare function parseSQL(sql: string, options: Omit<ParseSQLOptions, 'independentCombinators'> & {
    independentCombinators: true;
}): DefaultRuleGroupTypeIC;
export { parseSQL };
