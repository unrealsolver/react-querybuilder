import type { DefaultRuleGroupType, DefaultRuleGroupTypeIC, ParseJsonLogicOptions, RQBJsonLogic } from '@react-querybuilder/ts/src/index.noReact';
/**
 * Converts a JsonLogic object into a query suitable for
 * the QueryBuilder component's `query` or `defaultQuery` props.
 */
declare function parseJsonLogic(rqbJsonLogic: string | RQBJsonLogic): DefaultRuleGroupType;
declare function parseJsonLogic(rqbJsonLogic: string | RQBJsonLogic, options: Omit<ParseJsonLogicOptions, 'independentCombinators'> & {
    independentCombinators?: false;
}): DefaultRuleGroupType;
declare function parseJsonLogic(rqbJsonLogic: string | RQBJsonLogic, options: Omit<ParseJsonLogicOptions, 'independentCombinators'> & {
    independentCombinators: true;
}): DefaultRuleGroupTypeIC;
export { parseJsonLogic };
