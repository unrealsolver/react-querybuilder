import type { JsonLogicAnd, JsonLogicDoubleNegation, JsonLogicEqual, JsonLogicGreaterThan, JsonLogicGreaterThanOrEqual, JsonLogicLessThan, JsonLogicLessThanOrEqual, JsonLogicNegation, JsonLogicNotEqual, JsonLogicOr, JsonLogicStrictEqual, JsonLogicStrictNotEqual, JsonLogicVar, RQBJsonLogic, RQBJsonLogicEndsWith, RQBJsonLogicStartsWith, RQBJsonLogicVar } from '@react-querybuilder/ts/src/index.noReact';
import type { JsonLogicBetweenExclusive, JsonLogicBetweenInclusive } from './types';
export declare const isJsonLogicVar: (logic: RQBJsonLogic) => logic is JsonLogicVar<RQBJsonLogicStartsWith | RQBJsonLogicEndsWith>;
export declare const isRQBJsonLogicVar: (logic: RQBJsonLogic) => logic is RQBJsonLogicVar;
export declare const isJsonLogicEqual: (logic: RQBJsonLogic) => logic is JsonLogicEqual;
export declare const isJsonLogicStrictEqual: (logic: RQBJsonLogic) => logic is JsonLogicStrictEqual;
export declare const isJsonLogicNotEqual: (logic: RQBJsonLogic) => logic is JsonLogicNotEqual;
export declare const isJsonLogicStrictNotEqual: (logic: RQBJsonLogic) => logic is JsonLogicStrictNotEqual;
export declare const isJsonLogicNegation: (logic: RQBJsonLogic) => logic is JsonLogicNegation;
export declare const isJsonLogicDoubleNegation: (logic: RQBJsonLogic) => logic is JsonLogicDoubleNegation;
export declare const isJsonLogicOr: (logic: RQBJsonLogic) => logic is JsonLogicOr<RQBJsonLogicStartsWith | RQBJsonLogicEndsWith>;
export declare const isJsonLogicAnd: (logic: RQBJsonLogic) => logic is JsonLogicAnd<RQBJsonLogicStartsWith | RQBJsonLogicEndsWith>;
export declare const isJsonLogicGreaterThan: (logic: RQBJsonLogic) => logic is JsonLogicGreaterThan<RQBJsonLogicStartsWith | RQBJsonLogicEndsWith>;
export declare const isJsonLogicGreaterThanOrEqual: (logic: RQBJsonLogic) => logic is JsonLogicGreaterThanOrEqual<RQBJsonLogicStartsWith | RQBJsonLogicEndsWith>;
export declare const isJsonLogicLessThan: (logic: RQBJsonLogic) => logic is JsonLogicLessThan<RQBJsonLogicStartsWith | RQBJsonLogicEndsWith>;
export declare const isJsonLogicLessThanOrEqual: (logic: RQBJsonLogic) => logic is JsonLogicLessThanOrEqual<RQBJsonLogicStartsWith | RQBJsonLogicEndsWith>;
export declare const isJsonLogicInArray: (logic: RQBJsonLogic) => logic is {
    in: [import("@react-querybuilder/ts/src/json-logic-js").RulesLogic<RQBJsonLogicStartsWith | RQBJsonLogicEndsWith>, import("@react-querybuilder/ts/src/json-logic-js").RulesLogic<RQBJsonLogicStartsWith | RQBJsonLogicEndsWith>[]];
};
export declare const isJsonLogicInString: (logic: RQBJsonLogic) => logic is {
    in: [import("@react-querybuilder/ts/src/json-logic-js").RulesLogic<RQBJsonLogicStartsWith | RQBJsonLogicEndsWith>, import("@react-querybuilder/ts/src/json-logic-js").RulesLogic<RQBJsonLogicStartsWith | RQBJsonLogicEndsWith>];
};
export declare const isJsonLogicBetweenExclusive: (logic: RQBJsonLogic) => logic is JsonLogicBetweenExclusive;
export declare const isJsonLogicBetweenInclusive: (logic: RQBJsonLogic) => logic is JsonLogicBetweenInclusive;
export declare const isRQBJsonLogicStartsWith: (logic: RQBJsonLogic) => logic is RQBJsonLogicStartsWith;
export declare const isRQBJsonLogicEndsWith: (logic: RQBJsonLogic) => logic is RQBJsonLogicEndsWith;
