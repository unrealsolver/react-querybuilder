import type { RuleGroupTypeAny, RuleType } from '@react-querybuilder/ts/src/index.noReact';
interface PrepareOptions {
    idGenerator?: () => string;
}
/**
 * Generates a valid rule
 */
export declare const prepareRule: (rule: RuleType, { idGenerator }?: PrepareOptions) => RuleType<string, string, any, string>;
/**
 * Generates a valid rule group
 */
export declare const prepareRuleGroup: <RG extends RuleGroupTypeAny>(queryObject: RG, { idGenerator }?: PrepareOptions) => RG;
/**
 * Generates a valid rule or group
 */
export declare const prepareRuleOrGroup: <RG extends RuleGroupTypeAny>(rg: RuleType<string, string, any, string> | RG, { idGenerator }?: PrepareOptions) => RuleType<string, string, any, string> | RG;
export {};
