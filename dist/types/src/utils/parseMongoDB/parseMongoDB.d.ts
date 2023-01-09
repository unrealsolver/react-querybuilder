import type { DefaultRuleGroupType, DefaultRuleGroupTypeIC, ParseMongoDbOptions } from '@react-querybuilder/ts/src/index.noReact';
/**
 * Converts a MongoDB query object or parseable string into a query suitable for
 * the QueryBuilder component's `query` or `defaultQuery` props.
 */
declare function parseMongoDB(mongoDbRules: string | Record<string, any>): DefaultRuleGroupType;
declare function parseMongoDB(mongoDbRules: string | Record<string, any>, options: Omit<ParseMongoDbOptions, 'independentCombinators'> & {
    independentCombinators?: false;
}): DefaultRuleGroupType;
declare function parseMongoDB(mongoDbRules: string | Record<string, any>, options: Omit<ParseMongoDbOptions, 'independentCombinators'> & {
    independentCombinators: true;
}): DefaultRuleGroupTypeIC;
export { parseMongoDB };
