import type { DefaultOperatorName, Field, OptionList, ValueSources } from '@react-querybuilder/ts/src/index.noReact';
export declare const isPojo: (obj: any) => obj is Record<string, any>;
export declare const getFieldsArray: (fields?: OptionList<Field> | Record<string, Field>) => Field<string, string, string, import("@react-querybuilder/ts/src/basic").Option<string>, import("@react-querybuilder/ts/src/basic").Option<string>>[];
export declare function fieldIsValidUtil({ fieldsFlat, fieldName, operator, subordinateFieldName, getValueSources, }: {
    fieldsFlat: Field[];
    getValueSources?: (field: string, operator: string) => ValueSources;
    fieldName: string;
    operator: DefaultOperatorName;
    subordinateFieldName?: string;
}): boolean;
