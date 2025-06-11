import { Box, Chip, Tooltip, Typography, styled } from '@mui/material';
import { useTranslations } from 'next-intl';
import EClassIcon from 'assets/product/eclass.svg';
import VecIcon from 'assets/product/vec_classification.svg';
import LabelIcon from '@mui/icons-material/Label';
/**
 * Type definition for product classification
 */
export interface ProductClassification {
    ProductClassificationSystem?: string;
    ProductClassId?: string;
}

interface ProductClassificationInfoBoxProps {
    productClassifications: ProductClassification[];
    markings: string[];
}

const StyledBox = styled(Box)(({ theme }) => ({
    display: 'flex',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: theme.spacing(2),
    padding: theme.spacing(2, 3),
    width: '100%',
}));

const LabelContainer = styled(Box)(({ theme }) => ({
    display: 'flex',
    alignItems: 'center',
    marginRight: theme.spacing(4),
}));

const ValueContainer = styled(Box)(({ theme }) => ({
    display: 'flex',
    alignItems: 'center',
    marginTop: theme.spacing(0.5),
    marginBottom: theme.spacing(0.5),
}));

export function KeyFactsBox({
    productClassifications,
    markings,
}: ProductClassificationInfoBoxProps) {
    const t = useTranslations('pages.productViewer');
    const validClassifications = productClassifications ?? [];

    // Return null if there are no valid classifications or markings to show
    if (validClassifications.length === 0 && markings.length === 0) {
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
                {validClassifications && validClassifications.map((classification, index) => (
                    <ValueContainer key={`classification-${index}`}>
                        <Tooltip title={classification.ProductClassId}>
                            <Chip
                                sx={{ color: 'primary.main', backgroundColor: 'grey.200', borderRadius: 5, padding: 0.5 }}
                                label={classification.ProductClassificationSystem || 'Classification'}
                                icon={classification.ProductClassificationSystem === 'ECLASS' ? eClassIcon : vecIcon}>
                            </Chip>
                        </Tooltip>
                    </ValueContainer>
                ))}
                {markings && markings.map((markingText, index) => (
                    <ValueContainer key={`classification-${index}`} data-testid="markings-element">
                            <Chip
                                sx={{ color: 'primary.main', backgroundColor: 'grey.200', borderRadius: 5, padding: 0.5 }}
                                label={markingText}
                                icon={<LabelIcon color='primary' />}>
                            </Chip>
                    </ValueContainer>
                ))}
            </StyledBox>
        </Box>
    );
}
