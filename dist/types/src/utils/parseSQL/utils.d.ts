import type { DefaultCombinatorNameExtended, DefaultOperatorName } from '@react-querybuilder/ts/src/index.noReact';
import type { ComparisonOperator, MixedAndXorOrList, SQLAndExpression, SQLExpression, SQLIdentifier, SQLLiteralValue, SQLOrExpression, SQLWhereObjectAny, SQLXorExpression } from './types';
export declare const isSQLLiteralValue: (v?: SQLWhereObjectAny) => v is SQLLiteralValue;
export declare const isSQLIdentifier: (v?: SQLWhereObjectAny) => v is SQLIdentifier;
export declare const isWildcardsOnly: (sqlExpr: SQLExpression) => boolean;
export declare const getParamString: (param: any) => string;
export declare const getFieldName: (f: string | SQLIdentifier) => string;
export declare const normalizeOperator: (op: ComparisonOperator, flip?: boolean) => DefaultOperatorName;
export declare const evalSQLLiteralValue: (valueObj: SQLLiteralValue) => string | number | boolean;
export declare const generateFlatAndOrList: (expr: SQLAndExpression | SQLOrExpression | SQLXorExpression) => (DefaultCombinatorNameExtended | SQLExpression)[];
export declare const generateMixedAndXorOrList: (expr: SQLAndExpression | SQLOrExpression | SQLXorExpression) => MixedAndXorOrList;
