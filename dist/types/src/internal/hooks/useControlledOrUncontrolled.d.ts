import type { RuleGroupTypeAny } from '@react-querybuilder/ts';
interface UseControlledOrUncontrolledParams {
    defaultQuery?: RuleGroupTypeAny;
    queryProp?: RuleGroupTypeAny;
    isFirstRender: boolean;
}
/**
 * Log errors when the component changes from controlled to uncontrolled,
 * vice versa, or both query and defaultQuery are provided.
 */
export declare const useControlledOrUncontrolled: ({ defaultQuery, queryProp, isFirstRender, }: UseControlledOrUncontrolledParams) => void;
export {};
