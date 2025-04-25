import { Box, Chip, Typography, styled } from '@mui/material';
import { tooltipText } from 'lib/util/ToolTipText';
import { useTranslations } from 'next-intl';
import EClassIcon from 'assets/product/eclass.svg';
import VecIcon from 'assets/product/vec_classification.svg';

/**
 * Type definition for product classification
 */
export interface ProductClassification {
    ProductClassificationSystem?: string;
    ProductClassId?: string;
}

interface ProductClassificationInfoBoxProps {
    productClassifications: ProductClassification[];

}

const StyledBox = styled(Box)(({ theme }) => ({
    display: 'flex',
    alignItems: 'center',
    padding: theme.spacing(3),
    width: '100%',
}));

const LabelContainer = styled(Box)(({ theme }) => ({
    display: 'flex',
    alignItems: 'center',
    marginRight: theme.spacing(5),
}));

const ValueContainer = styled(Box)(({ theme }) => ({
    display: 'flex',
    alignItems: 'center',
    marginRight: theme.spacing(3),
}));

/**
 * A component that displays product classification information with a label and values in a horizontal layout.
 * The component renders a box with a main label "Classification Info" followed by classification systems and their values.
 */
export function ProductClassificationInfoBox({
    productClassifications,
}: ProductClassificationInfoBoxProps) {
    const t = useTranslations('pages.productViewer');
    // If there are no classifications to show, don't render the component
    if (!productClassifications || productClassifications.length === 0) {
        return null;
    }

    const vecIcon = <VecIcon color='primary'></VecIcon>;
    const eClassIcon = <EClassIcon color='primary'></EClassIcon>;

    return (
        <Box>
            <StyledBox bgcolor={'grey.100'}>
                <LabelContainer>
                    <Typography sx={{ borderBottom: '2px solid', borderColor: 'primary' }} color="primary" fontWeight="bold">
                        {t('summary')}
                    </Typography>
                </LabelContainer>

                {productClassifications
                    .filter((c) => c.ProductClassificationSystem !== 'IEC')
                    .map((classification, index) => (
                        <ValueContainer key={`classification-${index}`}>
                            <Chip
                                sx={{ color: 'primary.main', backgroundColor: 'grey.200', borderRadius: 5, padding: 0.5 }}
                                label={classification.ProductClassificationSystem || 'Classification'}
                                icon={classification.ProductClassificationSystem === 'ECLASS' ? vecIcon : eClassIcon}>
                            </Chip>
                            <Typography variant="body1" ml={1}>
                                {tooltipText(classification.ProductClassId, 35) || '-'}
                            </Typography>
                        </ValueContainer>
                    ))
                }
            </StyledBox >
        </Box >
    );
}
