import type { Field, Option, OptionGroup, OptionList } from '@react-querybuilder/ts/src/index.noReact';
export declare const isOptionGroupArray: (arr: Field['values']) => arr is OptionGroup<Option<string>>[];
export declare const getOption: <OptType extends Option<string> = Option<string>>(arr: OptionList<OptType>, name: string) => OptType | undefined;
export declare const getFirstOption: (arr?: OptionList) => string | null;
