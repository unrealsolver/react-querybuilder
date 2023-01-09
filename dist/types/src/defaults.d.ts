import type { Classnames, DefaultCombinator, DefaultCombinatorExtended, DefaultOperator, DefaultOperatorName, TranslationsFull } from '@react-querybuilder/ts/src/index.noReact';
export declare const defaultPlaceholderFieldName = "~";
export declare const defaultPlaceholderFieldLabel = "------";
export declare const defaultPlaceholderFieldGroupLabel = "------";
export declare const defaultPlaceholderOperatorName = "~";
export declare const defaultPlaceholderOperatorLabel = "------";
export declare const defaultPlaceholderOperatorGroupLabel = "------";
export declare const defaultJoinChar = ",";
export declare const defaultTranslations: TranslationsFull;
export declare const defaultOperators: DefaultOperator[];
export declare const defaultOperatorNegationMap: Record<DefaultOperatorName, DefaultOperatorName>;
export declare const defaultCombinators: DefaultCombinator[];
export declare const defaultCombinatorsExtended: DefaultCombinatorExtended[];
export declare const standardClassnames: {
    readonly queryBuilder: "queryBuilder";
    readonly ruleGroup: "ruleGroup";
    readonly header: "ruleGroup-header";
    readonly body: "ruleGroup-body";
    readonly combinators: "ruleGroup-combinators";
    readonly addRule: "ruleGroup-addRule";
    readonly addGroup: "ruleGroup-addGroup";
    readonly cloneRule: "rule-cloneRule";
    readonly cloneGroup: "ruleGroup-cloneGroup";
    readonly removeGroup: "ruleGroup-remove";
    readonly notToggle: "ruleGroup-notToggle";
    readonly rule: "rule";
    readonly fields: "rule-fields";
    readonly operators: "rule-operators";
    readonly value: "rule-value";
    readonly removeRule: "rule-remove";
    readonly betweenRules: "betweenRules";
    readonly valid: "queryBuilder-valid";
    readonly invalid: "queryBuilder-invalid";
    readonly dndDragging: "dndDragging";
    readonly dndOver: "dndOver";
    readonly dndCopy: "dndCopy";
    readonly dragHandle: "queryBuilder-dragHandle";
    readonly disabled: "queryBuilder-disabled";
    readonly lockRule: "rule-lock";
    readonly lockGroup: "ruleGroup-lock";
    readonly valueSource: "rule-valueSource";
    readonly valueListItem: "rule-value-list-item";
    readonly branches: "queryBuilder-branches";
};
export declare const defaultControlClassnames: Classnames;
export declare const groupInvalidReasons: {
    readonly empty: "empty";
    readonly invalidCombinator: "invalid combinator";
    readonly invalidIndependentCombinators: "invalid independent combinators";
};
export declare const TestID: {
    readonly rule: "rule";
    readonly ruleGroup: "rule-group";
    readonly inlineCombinator: "inline-combinator";
    readonly addGroup: "add-group";
    readonly removeGroup: "remove-group";
    readonly cloneGroup: "clone-group";
    readonly cloneRule: "clone-rule";
    readonly addRule: "add-rule";
    readonly removeRule: "remove-rule";
    readonly combinators: "combinators";
    readonly fields: "fields";
    readonly operators: "operators";
    readonly valueEditor: "value-editor";
    readonly notToggle: "not-toggle";
    readonly dragHandle: "drag-handle";
    readonly lockRule: "lock-rule";
    readonly lockGroup: "lock-group";
    readonly valueSourceSelector: "value-source-selector";
};
export declare const LogType: {
    readonly parentPathDisabled: "action aborted: parent path disabled";
    readonly pathDisabled: "action aborted: path is disabled";
    readonly queryUpdate: "query updated";
    readonly onAddRuleFalse: "onAddRule callback returned false";
    readonly onAddGroupFalse: "onAddGroup callback returned false";
    readonly onRemoveFalse: "onRemove callback returned false";
};
