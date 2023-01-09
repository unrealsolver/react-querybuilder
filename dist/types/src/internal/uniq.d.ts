import type { Option, OptionGroup } from '@react-querybuilder/ts/src/index.noReact';
export declare const uniqByName: <T extends {
    name: string;
}>(originalArray: T[]) => T[];
export declare const uniqOptGroups: <T extends Option<string>>(originalArray: OptionGroup<T>[]) => OptionGroup<T>[];
