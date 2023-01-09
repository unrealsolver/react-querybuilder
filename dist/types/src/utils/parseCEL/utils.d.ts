import type { DefaultCombinatorName, DefaultOperatorName } from '@react-querybuilder/ts/src/index.noReact';
import type { CELBooleanLiteral, CELBytesLiteral, CELConditionalAnd, CELConditionalOr, CELExpression, CELExpressionGroup, CELIdentifier, CELLikeExpression, CELList, CELLiteral, CELMap, CELMember, CELNegation, CELNullLiteral, CELNumericLiteral, CELRelation, CELRelop, CELStringLiteral } from './types';
export declare const isCELExpressionGroup: (expr: CELExpression) => expr is CELExpressionGroup;
export declare const isCELConditionalAnd: (expr: CELExpression) => expr is CELConditionalAnd;
export declare const isCELConditionalOr: (expr: CELExpression) => expr is CELConditionalOr;
export declare const isCELStringLiteral: (expr: CELExpression) => expr is CELStringLiteral;
export declare const isCELLiteral: (expr: CELExpression) => expr is CELLiteral;
export declare const isCELNumericLiteral: (expr: CELExpression) => expr is CELNumericLiteral;
export declare const isCELRelation: (expr: CELExpression) => expr is CELRelation;
export declare const isCELList: (expr: CELExpression) => expr is CELList;
export declare const isCELMap: (expr: CELExpression) => expr is CELMap;
export declare const isCELIdentifier: (expr: CELExpression) => expr is CELIdentifier<string>;
export declare const isCELNegation: (expr: CELExpression) => expr is CELNegation;
export declare const isCELMember: (expr: CELExpression) => expr is CELMember;
export declare const isCELLikeExpression: (expr: CELExpression) => expr is CELLikeExpression;
declare function evalCELLiteralValue(literal: CELStringLiteral): string;
declare function evalCELLiteralValue(literal: CELBooleanLiteral): boolean;
declare function evalCELLiteralValue(literal: CELNumericLiteral): number | null;
declare function evalCELLiteralValue(literal: CELBytesLiteral): null;
declare function evalCELLiteralValue(literal: CELNullLiteral): null;
declare function evalCELLiteralValue(literal: CELLiteral): string | boolean | number | null;
export declare const normalizeCombinator: (c: '&&' | '||') => DefaultCombinatorName;
export declare const normalizeOperator: (op: CELRelop, flip?: boolean) => DefaultOperatorName;
export declare const generateFlatAndOrList: (expr: CELConditionalAnd | CELConditionalOr) => (DefaultCombinatorName | CELExpression)[];
export declare const generateMixedAndOrList: (expr: CELConditionalAnd | CELConditionalOr) => (DefaultCombinatorName | CELExpression | ("and" | CELExpression)[])[];
export { evalCELLiteralValue };