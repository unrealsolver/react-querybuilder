import type { ValueProcessorLegacy } from '@react-querybuilder/ts/src/index.noReact';
import { defaultRuleProcessorCEL } from './defaultRuleProcessorCEL';
import { defaultRuleProcessorMongoDB } from './defaultRuleProcessorMongoDB';
import { defaultRuleProcessorSpEL } from './defaultRuleProcessorSpEL';
import { defaultValueProcessorByRule } from './defaultValueProcessorByRule';
export declare const defaultValueProcessor: ValueProcessorLegacy;
/**
 * @deprecated Prefer `defaultRuleProcessorMongoDB`.
 */
export declare const defaultMongoDBValueProcessor: ValueProcessorLegacy;
/**
 * @deprecated Prefer `defaultRuleProcessorCEL`.
 */
export declare const defaultCELValueProcessor: ValueProcessorLegacy;
/**
 * @deprecated Prefer `defaultRuleProcessorSpEL`.
 */
export declare const defaultSpELValueProcessor: ValueProcessorLegacy;
export { defaultRuleProcessorJsonLogic } from './defaultRuleProcessorJsonLogic';
export * from './formatQuery';
export { jsonLogicAdditionalOperators } from './utils';
export { defaultValueProcessorByRule };
export { defaultRuleProcessorCEL };
export { defaultRuleProcessorMongoDB };
export { defaultRuleProcessorSpEL };
/**
 * @deprecated Renamed to "defaultRuleProcessorMongoDB".
 */
export declare const defaultValueProcessorCELByRule: import("@react-querybuilder/ts/src/importExport").RuleProcessor;
/**
 * @deprecated Renamed to "defaultRuleProcessorCEL".
 */
export declare const defaultValueProcessorMongoDBByRule: import("@react-querybuilder/ts/src/importExport").RuleProcessor;
/**
 * @deprecated Renamed to "defaultRuleProcessorSpEL".
 */
export declare const defaultValueProcessorSpELByRule: import("@react-querybuilder/ts/src/importExport").RuleProcessor;
