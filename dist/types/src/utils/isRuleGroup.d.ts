import type { RuleGroupType, RuleGroupTypeAny, RuleGroupTypeIC, RuleType } from '@react-querybuilder/ts/src/index.noReact';
/**
 * Determines if this is either a RuleGroupType or RuleGroupTypeIC.
 * `'rules' in query` can be used as an alternative.
 */
export declare const isRuleGroup: (rg: RuleType | RuleGroupTypeAny) => rg is RuleGroupTypeAny;
export declare const isRuleGroupType: (rg: RuleType | RuleGroupTypeAny) => rg is RuleGroupType<RuleType<string, string, any, string>, string>;
export declare const isRuleGroupTypeIC: (rg: RuleType | RuleGroupTypeAny) => rg is RuleGroupTypeIC<RuleType<string, string, any, string>, string>;
