import type { RuleGroupType, RuleGroupTypeIC, RuleType } from '@react-querybuilder/ts/src/index.noReact';
export declare const convertFromIC: <RG extends RuleGroupType<RuleType<string, string, any, string>, string> = RuleGroupType<RuleType<string, string, any, string>, string>>(rg: RuleGroupTypeIC) => RG;
export declare const convertToIC: <RGIC extends RuleGroupTypeIC<RuleType<string, string, any, string>, string> = RuleGroupTypeIC<RuleType<string, string, any, string>, string>>(rg: RuleGroupType) => RGIC;
declare function convertQuery(query: RuleGroupType): RuleGroupTypeIC;
declare function convertQuery(query: RuleGroupTypeIC): RuleGroupType;
export { convertQuery };
