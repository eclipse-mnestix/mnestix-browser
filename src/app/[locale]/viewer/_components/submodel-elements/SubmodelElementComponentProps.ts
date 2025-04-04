import { ISubmodelElement } from '@aas-core-works/aas-core3.0-typescript/types';

export type SubmodelElementComponentProps = {
    submodelElement?: ISubmodelElement;
    submodelId?: string;
    hasDivider?: boolean;
    key?: string | number | null;
};
