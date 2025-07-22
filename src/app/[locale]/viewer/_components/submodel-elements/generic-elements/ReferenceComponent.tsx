import { Typography, Box } from '@mui/material';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import { Reference } from '@aas-core-works/aas-core3.0-typescript/types';
import { useTranslations } from 'next-intl';

type ReferenceProps = {
    readonly reference: Reference;
    readonly showAllKeys?: boolean; // Optional prop to control key display
};

export function ReferenceComponent({ reference, showAllKeys = true }: ReferenceProps) {
    const t = useTranslations('components.referenceComponent');

    if ((!reference.type && reference.type != 0) || reference.type === undefined) {
        return <Typography data-testid="no-type-specified">{t('noTypeSpecified')}</Typography>;
    }

    const getKeys = () => {
        const keys = reference.keys;
        if (!showAllKeys) {
            return [keys[keys.length - 1]];
        } else {
            return keys;
        }
    };

    const renderReferenceKeys = () => {
        if (!reference?.keys || reference.keys.length === 0 || !Array.isArray(reference.keys)) {
            return <Typography data-testid="no-reference-path-available">{t('noReferencePathAvailable')}</Typography>;
        }

        const keys = getKeys();

        return (
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, flexWrap: 'wrap', marginTop: 1 }}>
                {keys.map((key, index) => {
                    const isLast = index === keys.length - 1;
                    const keyValue = typeof key === 'object' && key !== null ? key.value : String(key);
                    const keyType = typeof key === 'object' && key !== null ? key.type : 'Unknown';

                    return (
                        <Box key={index} sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            <Box
                                sx={{
                                    padding: '4px 8px',
                                    borderRadius: '4px',
                                    backgroundColor: isLast ? 'primary.main' : 'background.paper',
                                    color: isLast ? 'primary.contrastText' : 'text.primary',
                                    border: isLast ? 'none' : '1px solid',
                                    borderColor: 'divider',
                                    textAlign: 'center',
                                    minWidth: '80px',
                                    boxShadow: isLast ? 1 : 0.5,
                                }}
                            >
                                <Typography
                                    variant="caption"
                                    sx={{
                                        marginBottom: '1px',
                                        fontSize: '0.75rem',
                                        fontWeight: isLast ? 'bold' : 'normal',
                                        display: 'block',
                                    }}
                                >
                                    {keyValue}
                                </Typography>
                                <Typography
                                    variant="caption"
                                    sx={{
                                        opacity: isLast ? 0.9 : 0.7,
                                        fontSize: '0.6rem',
                                        display: 'block',
                                    }}
                                >
                                    ({keyType})
                                </Typography>
                            </Box>

                            {/* Arrow (except for last item) */}
                            {!isLast && (
                                <ArrowForwardIcon
                                    sx={{
                                        fontSize: 14,
                                        color: 'text.secondary',
                                    }}
                                />
                            )}
                        </Box>
                    );
                })}
            </Box>
        );
    };

    return (
        <Box>
            {renderReferenceKeys()}
            <Typography variant="caption" color="text.secondary" sx={{ mt: 1, display: 'block' }}>
                {t('referenceType', { type: reference.type })}
            </Typography>
        </Box>
    );
}
