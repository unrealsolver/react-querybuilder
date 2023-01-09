import type { RuleGroupType, RuleGroupTypeIC, RuleType } from '@react-querybuilder/ts/src/index.noReact';
interface RegenerateIdOptions {
    idGenerator?: () => string;
}
export declare const regenerateID: (rule: RuleType, { idGenerator }?: RegenerateIdOptions) => RuleType;
export declare const regenerateIDs: (ruleGroup: RuleGroupType | RuleGroupTypeIC, { idGenerator }?: RegenerateIdOptions) => RuleGroupType | RuleGroupTypeIC;
export {};
