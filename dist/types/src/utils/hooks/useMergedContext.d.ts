import type { Controls, QueryBuilderContextProps, TranslationsFull, WithRequired } from '@react-querybuilder/ts';
type UseMergedContextProps = WithRequired<QueryBuilderContextProps, 'translations'>;
export declare const useMergedContext: (props: UseMergedContextProps) => {
    controlClassnames: import("@react-querybuilder/ts").Classnames;
    controlElements: Controls;
    debugMode: boolean;
    enableDragAndDrop: boolean;
    enableMountQueryChange: boolean;
    translations: TranslationsFull;
};
export {};
