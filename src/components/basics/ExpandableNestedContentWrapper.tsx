import { KeyboardArrowDown, KeyboardArrowUp } from '@mui/icons-material';
import { Box, Button } from '@mui/material';
import { DataRow } from 'components/basics/DataRow';
import { NestedContentWrapper } from 'components/basics/NestedContentWrapper';
import { messages } from 'lib/i18n/localization';
import { useState } from 'react';
import { FormattedMessage } from 'react-intl';
import { GenericSubmodelDetailComponent } from 'app/[locale]/viewer/_components/submodel/generic-submodel/GenericSubmodelDetailComponent';
import { SubmodelVisualizationProps } from 'app/[locale]/viewer/_components/submodel/SubmodelVisualizationProps';

export function ExpandableDefaultSubmodelDisplay({ submodel }: SubmodelVisualizationProps) {
    const [isExpanded, setIsExpanded] = useState(false);
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
                    <FormattedMessage
                        {...messages.mnestix.showEntriesButton[isExpanded ? 'hide' : 'show']}
                        values={{ count: submodel.submodelElements.length }}
                    />
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
