import { Box, Card, CardContent, Typography } from '@mui/material';
import ScannerLogo from 'assets/ScannerLogo.svg';
import { useTheme } from '@mui/material/styles';
import { useTranslations } from 'next-intl';

type AddAasToCompareCardProps = {
    onClick: () => void;
    isFirst?: boolean;
};

export function AddAasToCompareCard(props: AddAasToCompareCardProps) {
    const isFirst = props.isFirst !== undefined ? props.isFirst : false;
    const theme = useTheme();
    const t = useTranslations('pages.compare');

    return (
        <Box
            onClick={props.onClick}
            data-testid="add-aas-to-compare-button"
            sx={{
                width: '33%',
                display: 'flex',
                cursor: 'pointer'
            }}>
            <Card>
                <CardContent>
                    {isFirst ? (
                        <Typography
                            variant="h2"
                            sx={{
                                textAlign: 'center',
                                margin: '30px 0'
                            }}>
                            {t('addFirstAasButton')}
                        </Typography>
                    ) : (
                        <Typography
                            variant="h2"
                            sx={{
                                textAlign: 'center',
                                margin: '30px 0'
                            }}>
                            {t('addButton')}
                        </Typography>
                    )}
                    <Box
                        style={{
                            display: 'flex',
                            justifyContent: 'center',
                            alignItems: 'center',
                            padding: '10px',
                        }}
                    >
                        <ScannerLogo alt="Scanner Logo" style={{ color: theme.palette.primary.main }} />
                    </Box>
                </CardContent>
            </Card>
        </Box>
    );
}
