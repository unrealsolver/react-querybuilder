import type { RuleGroupTypeAny, RuleType, RuleValidator, ValidationResult } from '@react-querybuilder/ts/src/index.noReact';
export declare const isValidationResult: (vr?: ValidationResult) => vr is ValidationResult;
export declare const isRuleOrGroupValid: (rg: RuleType | RuleGroupTypeAny, validationResult?: boolean | ValidationResult, validator?: RuleValidator) => boolean;
