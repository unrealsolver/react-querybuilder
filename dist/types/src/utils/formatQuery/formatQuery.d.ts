import type { ExportFormat, FormatQueryOptions, ParameterizedNamedSQL, ParameterizedSQL, RQBJsonLogic, RuleGroupTypeAny } from '@react-querybuilder/ts/src/index.noReact';
/**
 * Formats a query in the requested output format.
 */
declare function formatQuery(ruleGroup: RuleGroupTypeAny): string;
declare function formatQuery(ruleGroup: RuleGroupTypeAny, options: 'parameterized' | (Omit<FormatQueryOptions, 'format'> & {
    format: 'parameterized';
})): ParameterizedSQL;
declare function formatQuery(ruleGroup: RuleGroupTypeAny, options: 'parameterized_named' | (Omit<FormatQueryOptions, 'format'> & {
    format: 'parameterized_named';
})): ParameterizedNamedSQL;
declare function formatQuery(ruleGroup: RuleGroupTypeAny, options: 'jsonlogic' | (Omit<FormatQueryOptions, 'format'> & {
    format: 'jsonlogic';
})): RQBJsonLogic;
declare function formatQuery(ruleGroup: RuleGroupTypeAny, options: Omit<FormatQueryOptions, 'format'>): string;
declare function formatQuery(ruleGroup: RuleGroupTypeAny, options: Exclude<ExportFormat, 'parameterized' | 'parameterized_named' | 'jsonlogic'>): string;
declare function formatQuery(ruleGroup: RuleGroupTypeAny, options: Omit<FormatQueryOptions, 'format'> & {
    format: Exclude<ExportFormat, 'parameterized' | 'parameterized_named' | 'jsonlogic'>;
}): string;
export { formatQuery };
