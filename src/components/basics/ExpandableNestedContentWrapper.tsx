import { KeyboardArrowDown, KeyboardArrowUp } from '@mui/icons-material';
import { Box, Button } from '@mui/material';
import { DataRow } from 'components/basics/DataRow';
import { NestedContentWrapper } from 'components/basics/NestedContentWrapper';
import { useState } from 'react';
import { GenericSubmodelDetailComponent } from 'app/[locale]/viewer/_components/submodel/generic-submodel/GenericSubmodelDetailComponent';
import { SubmodelVisualizationProps } from 'app/[locale]/viewer/_components/submodel/SubmodelVisualizationProps';
import { useTranslations } from 'next-intl';

export function ExpandableDefaultSubmodelDisplay({ submodel }: SubmodelVisualizationProps) {
    const [isExpanded, setIsExpanded] = useState(false);
    const t = useTranslations('components.submodelElementCollection');
    return submodel.submodelElements && submodel.submodelElements.length ? (
        <DataRow title="All available data" hasDivider={true}>
            <Box>
                <Button
                    variant="outlined"
                    startIcon={isExpanded ? <KeyboardArrowUp /> : <KeyboardArrowDown />}
                    sx={{ my: 1 }}
                    onClick={() => setIsExpanded(!isExpanded)}
                    data-testid="submodel-dropdown-button"
                >
                    {isExpanded
                        ? t('showEntriesButton.hide')
                        : t('showEntriesButton.show', { count: submodel.submodelElements.length })}
                </Button>
                {isExpanded && (
                    <NestedContentWrapper>
                        <GenericSubmodelDetailComponent submodel={submodel} />
                    </NestedContentWrapper>
                )}
            </Box>
        </DataRow>
    ) : (
        <></>
    );
}
