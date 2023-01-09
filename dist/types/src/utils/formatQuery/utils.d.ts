import type { DefaultCombinatorName, RuleGroupTypeAny, ValueProcessorByRule, ValueProcessorLegacy } from '@react-querybuilder/ts/src/index.noReact';
export declare const numericRegex: RegExp;
export declare const mapSQLOperator: (op: string) => string;
export declare const mongoOperators: {
    '=': string;
    '!=': string;
    '<': string;
    '<=': string;
    '>': string;
    '>=': string;
    in: string;
    notIn: string;
};
export declare const celCombinatorMap: Record<DefaultCombinatorName, '&&' | '||'>;
/**
 * Register these operators with jsonLogic before applying the
 * result of formatQuery(query, 'jsonlogic').
 *
 * @example
 * for (const [op, func] of Object.entries(jsonLogicAdditionalOperators)) {
 *   jsonLogic.add_operation(op, func);
 * }
 * jsonLogic.apply({ "startsWith": [{ "var": "firstName" }, "Stev"] }, data);
 */
export declare const jsonLogicAdditionalOperators: Record<'startsWith' | 'endsWith', (...args: any[]) => boolean>;
export declare const numerifyValues: (rg: RuleGroupTypeAny) => RuleGroupTypeAny;
export declare const isValidValue: (v: any) => boolean;
export declare const shouldRenderAsNumber: (v: any, parseNumbers?: boolean) => boolean;
export declare const isValueProcessorLegacy: (vp: ValueProcessorLegacy | ValueProcessorByRule) => vp is ValueProcessorLegacy;
