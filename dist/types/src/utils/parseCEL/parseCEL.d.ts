import type { DefaultRuleGroupType, DefaultRuleGroupTypeIC, ParseCELOptions } from '@react-querybuilder/ts/src/index.noReact';
/**
 * Converts a CEL string expression into a query suitable for
 * the QueryBuilder component's `query` or `defaultQuery` props.
 */
declare function parseCEL(cel: string): DefaultRuleGroupType;
declare function parseCEL(cel: string, options: Omit<ParseCELOptions, 'independentCombinators'> & {
    independentCombinators?: false;
}): DefaultRuleGroupType;
declare function parseCEL(cel: string, options: Omit<ParseCELOptions, 'independentCombinators'> & {
    independentCombinators: true;
}): DefaultRuleGroupTypeIC;
export { parseCEL };
