import type { Field, OptionList } from '@react-querybuilder/ts/src/index.noReact';
export declare const filterFieldsByComparator: (field: Field, fields: OptionList<Field>, operator: string) => Field<string, string, string, import("@react-querybuilder/ts/src/basic").Option<string>, import("@react-querybuilder/ts/src/basic").Option<string>>[] | {
    options: Field<string, string, string, import("@react-querybuilder/ts/src/basic").Option<string>, import("@react-querybuilder/ts/src/basic").Option<string>>[];
    label: string;
}[];
