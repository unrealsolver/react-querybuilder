import type { Field, ValueSources } from '@react-querybuilder/ts/src/index.noReact';
export declare const getValueSourcesUtil: (fieldData: Field, operator: string, getValueSources?: ((field: string, operator: string) => ValueSources) | undefined) => ValueSources;
