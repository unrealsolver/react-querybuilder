import type { RuleGroupTypeAny, RuleType } from '@react-querybuilder/ts/src/index.noReact';
type FindPathReturnType = RuleGroupTypeAny | RuleType | null;
export declare const findPath: (path: number[], query: RuleGroupTypeAny) => FindPathReturnType;
export declare const getParentPath: (path: number[]) => number[];
export declare const pathsAreEqual: (path1: number[], path2: number[]) => boolean;
export declare const isAncestor: (maybeAncestor: number[], path: number[]) => boolean;
export declare const getCommonAncestorPath: (path1: number[], path2: number[]) => number[];
export declare const pathIsDisabled: (path: number[], query: RuleGroupTypeAny) => boolean;
export {};
