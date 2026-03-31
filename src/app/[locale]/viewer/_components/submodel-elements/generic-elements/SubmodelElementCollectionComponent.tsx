import { Box } from '@mui/material';
import { SubmodelElementCollection } from '@aas-core-works/aas-core3.0-typescript/types';
import { ReactNode } from 'react';
import { GenericSubmodelElementComponent } from './GenericSubmodelElementComponent';

type SubmodelElementComponentProps = {
    readonly submodelId?: string;
    readonly submodelElementPath?: string;
    readonly submodelElementCollection: SubmodelElementCollection;
};

export function SubmodelElementCollectionComponent({
    submodelId,
    submodelElementPath,
    submodelElementCollection,
}: SubmodelElementComponentProps) {
    const componentList: ReactNode[] = [];

    if (
        !submodelElementCollection.value ||
        (Array.isArray(submodelElementCollection.value) && !submodelElementCollection.value?.length) ||
        !Object.keys(submodelElementCollection.value).length
    ) {
        return <></>;
    }
    submodelElementCollection.value.forEach((val, index) => {
        componentList.push(
            <GenericSubmodelElementComponent
                key={index}
                submodelElement={val}
                hasDivider={!(index === 0)}
                submodelId={submodelId}
                submodelElementPath={submodelElementPath}
            />,
        );
    });

    return (
        <Box
            sx={{
                display: 'grid',
                gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' },
                gap: { xs: 1, sm: 2 },
                alignItems: 'start',
            }}
        >
            {componentList}
        </Box>
    );
}
