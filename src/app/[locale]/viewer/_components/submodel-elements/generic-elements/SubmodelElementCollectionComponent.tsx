import { KeyboardArrowDown, KeyboardArrowUp } from '@mui/icons-material';
import { Box, Button } from '@mui/material';
import { SubmodelElementCollection, SubmodelElementList } from 'lib/api/aas/models';
import { NestedContentWrapper } from 'components/basics/NestedContentWrapper';
import { ReactNode, useState } from 'react';
import { GenericSubmodelElementComponent } from './GenericSubmodelElementComponent';
import { useTranslations } from 'next-intl';

enum ExpandButtonText {
    show = 'show',
    hide = 'hide',
}

type SubmodelElementComponentProps = {
    readonly submodelId?: string;
    readonly submodelElementPath?: string;
    readonly submodelElementCollection: SubmodelElementCollection | SubmodelElementList;
};

export function SubmodelElementCollectionComponent({
    submodelId,
    submodelElementPath,
    submodelElementCollection,
}: SubmodelElementComponentProps) {
    const [isExpanded, setIsExpanded] = useState(false);
    const componentList: ReactNode[] = [];
    const t = useTranslations('components.submodelElementCollection');

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
        <Box>
            <Button
                variant="outlined"
                startIcon={isExpanded ? <KeyboardArrowUp /> : <KeyboardArrowDown />}
                sx={{ my: 1 }}
                onClick={() => setIsExpanded(!isExpanded)}
                data-testid="submodel-dropdown-button"
            >
                {t(`showEntriesButton.${isExpanded ? ExpandButtonText.hide : ExpandButtonText.show}`, {
                    count: Object.keys(submodelElementCollection.value).length,
                })}
            </Button>
            {isExpanded && <NestedContentWrapper>{componentList}</NestedContentWrapper>}
        </Box>
    );
}
