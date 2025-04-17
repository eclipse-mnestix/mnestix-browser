import { Box, Chip, Typography, styled } from '@mui/material';
import { theme } from 'layout/theme/theme';

/**
 * Type definition for product classification
 */
export interface ProductClassification {
    ProductClassificationSystem?: string;
    ProductClassId?: string;
}

/**
 * Props for the ProductClassificationInfoBox component
 */
interface ProductClassificationInfoBoxProps {
    /**
     * Array of product classifications to display
     */
    productClassifications: ProductClassification[];
    /**
     * Optional flag to show only the first classification
     */
    showOnlyFirst?: boolean;
}

const StyledBox = styled(Box)(({ theme }) => ({
    display: 'flex',
    alignItems: 'center',
    padding: theme.spacing(3),
    border: `1px solid ${theme.palette.divider}`,
    borderRadius: theme.shape.borderRadius,
    width: '100%',
}));

const LabelContainer = styled(Box)(({ theme }) => ({
    display: 'flex',
    alignItems: 'center',
    marginRight: theme.spacing(3),
}));

const ValueContainer = styled(Box)(({ theme }) => ({
    display: 'flex',
    alignItems: 'center',
    marginRight: theme.spacing(4),
}));

/**
 * A component that displays product classification information with a label and values in a horizontal layout.
 * The component renders a box with a main label "Classification Info" followed by classification systems and their values.
 */
function ProductClassificationInfoBox({
    productClassifications,
    showOnlyFirst = false,
}: ProductClassificationInfoBoxProps) {
    // If there are no classifications to show, don't render the component
    if (!productClassifications || productClassifications.length === 0) {
        return null;
    }

    // Determine which classifications to display
    const classificationsToShow = showOnlyFirst
        ? [productClassifications[0]]
        : productClassifications;

    return (
        <Box>
            <StyledBox bgcolor={'#F6F7FA'}>
                <LabelContainer>
                    <Typography variant="subtitle1" fontWeight="bold">
                        Summary
                    </Typography>
                </LabelContainer>

                {classificationsToShow
                    .filter((c) => c.ProductClassificationSystem !== 'IEC')
                    .map((classification, index) => (
                        <ValueContainer key={`classification-${index}`}>
                            <Chip variant="outlined"
                                sx={{ backgroundColor: '#6B7374', color: 'white', borderRadius: 5, padding: 0.5 }} // TODO colors
                                label={classification.ProductClassificationSystem || 'Classification'}
                            >
                            </Chip>
                            <Typography variant="body1" ml={1}>
                                {classification.ProductClassId || '-'}
                            </Typography>
                        </ValueContainer>
                    ))}
            </StyledBox>
        </Box>
    );
}

export { ProductClassificationInfoBox };
export type { ProductClassificationInfoBoxProps };
