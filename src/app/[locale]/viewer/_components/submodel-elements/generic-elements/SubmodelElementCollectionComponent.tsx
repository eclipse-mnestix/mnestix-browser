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
            <Box key={index} sx={{ display: 'grid', gridColumn: 'span 1' }}>
                <GenericSubmodelElementComponent
                    key={index}
                    submodelElement={val}
                    hasDivider={false}
                    submodelId={submodelId}
                    submodelElementPath={submodelElementPath}
                />
            </Box>,
        );
    });

    return (
        <Box
            sx={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(30%, 1fr))',
                gap: 2,
            }}
        >
            {componentList}
        </Box>
    );
}
