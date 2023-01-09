import type { OptionList, RuleGroupTypeAny, RuleType, UpdateableProperties, ValueSources } from '@react-querybuilder/ts/src/index.noReact';
interface AddOptions {
    /**
     * If the query is of type `RuleGroupTypeIC` (i.e. the query builder used
     * `independentCombinators`), then the first combinator in this list will be
     * inserted before the new rule/group if the parent group is not empty. This
     * option is overridden by `combinatorPreceding`.
     */
    combinators?: OptionList;
    /**
     * If the query is of type `RuleGroupTypeIC` (i.e. the query builder used
     * `independentCombinators`), then this combinator will be inserted before
     * the new rule/group if the parent group is not empty. This option will
     * override `combinators`.
     */
    combinatorPreceding?: string;
    /**
     * ID generator.
     */
    idGenerator?: () => string;
}
/**
 * Adds a rule or group to a query.
 * @param query The query to update
 * @param ruleOrGroup The rule or group to add
 * @param parentPath Path of the group to add to
 * @param options
 * @returns The full query with the new rule or group added
 */
export declare const add: <RG extends RuleGroupTypeAny>(query: RG, ruleOrGroup: RuleType<string, string, any, string> | RG, parentPath: number[], { combinators, combinatorPreceding, idGenerator, }?: AddOptions) => RG;
interface UpdateOptions {
    /**
     * When updating the `field` of a rule, the rule's `operator`, `value`, and `valueSource`
     * will be reset to their respective defaults. Defaults to `true`.
     */
    resetOnFieldChange?: boolean;
    /**
     * When updating the `operator` of a rule, the rule's `value` and `valueSource`
     * will be reset to their respective defaults. Defaults to `false`.
     */
    resetOnOperatorChange?: boolean;
    /**
     * Determines the default operator name for a given field.
     */
    getRuleDefaultOperator?: (field: string) => string;
    /**
     * Determines the valid value sources for a given field and operator.
     */
    getValueSources?: (field: string, operator: string) => ValueSources;
    /**
     * Gets the default value for a given rule, in case the value needs to be reset.
     */
    getRuleDefaultValue?: (rule: RuleType) => any;
}
/**
 * Updates a property of a rule or group within a query.
 * @param query The query to update
 * @param prop The name of the property to update
 * @param value The new value of the property
 * @param path The path of the rule or group to update
 * @param options
 * @returns The updated query
 */
export declare const update: <RG extends RuleGroupTypeAny>(query: RG, prop: UpdateableProperties, value: any, path: number[], { resetOnFieldChange, resetOnOperatorChange, getRuleDefaultOperator, getValueSources, getRuleDefaultValue, }?: UpdateOptions) => RG;
/**
 * Removes a rule or group from a query.
 * @param query The query to update
 * @param path Path of the rule or group to remove
 * @returns The updated query
 */
export declare const remove: <RG extends RuleGroupTypeAny>(query: RG, path: number[]) => RG;
interface MoveOptions {
    /**
     * When `true`, the source rule/group will not be removed from its original path.
     */
    clone?: boolean;
    /**
     * If the query is of type `RuleGroupTypeIC` (i.e. the query builder used
     * `independentCombinators`), then the first combinator in this list will be
     * inserted before the rule/group if necessary.
     */
    combinators?: OptionList;
    /**
     * ID generator.
     */
    idGenerator?: () => string;
}
/**
 * Moves a rule or group from one path to another. In the options parameter, pass
 * `{ clone: true }` to copy instead of move.
 * @param query The query to update
 * @param oldPath Original path of the rule or group to move
 * @param newPath Path to move the rule or group to
 * @param options
 * @returns The updated query
 */
export declare const move: <RG extends RuleGroupTypeAny>(query: RG, oldPath: number[], newPath: number[], { clone, combinators, idGenerator }?: MoveOptions) => RG;
export {};
