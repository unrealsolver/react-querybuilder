import type { QueryBuilderContextProps, QueryBuilderContextProvider } from '@react-querybuilder/ts';
export type GetCompatContextProviderProps = Pick<QueryBuilderContextProps, 'controlClassnames' | 'controlElements'> & {
    key: string;
};
export declare const getCompatContextProvider: ({ key, controlClassnames: compatClassnames, controlElements: compatElements, }: GetCompatContextProviderProps) => QueryBuilderContextProvider;
