import { Typography, Box } from '@mui/material';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import { Reference } from '@aas-core-works/aas-core3.0-typescript/types';

type ReferenceProps = {
    readonly reference: Reference;
};

export function ReferenceComponent(props: ReferenceProps) {
    if (!props.reference.type || props.reference.type === undefined) {
        return <Typography variant="body2">No type specified</Typography>;
    }

    const renderReferenceKeys = () => {
        if (!props.reference?.keys || !Array.isArray(props.reference.keys)) {
            return <Typography variant="body2">No reference path available</Typography>;
        }

        const keys = props.reference.keys;

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
                Reference Type: {props.reference.type}
            </Typography>
        </Box>
    );
}
