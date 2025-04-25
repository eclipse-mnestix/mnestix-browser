import { SubmodelElementChoice } from 'lib/types/AasTypes';

export type SubmodelElementComponentProps = {
    submodelElement?: SubmodelElementChoice;
    submodelId?: string;
    hasDivider?: boolean;
    key?: string | number | null;
};
