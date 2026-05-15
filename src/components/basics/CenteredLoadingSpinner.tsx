import { Box, BoxProps, CircularProgress } from '@mui/material';

export function CenteredLoadingSpinner(props: BoxProps) {
    return (
        <Box
            {...props}
            sx={[{
                display: 'flex',
                justifyContent: 'center'
            }, ...(Array.isArray(props.sx) ? props.sx : [props.sx])]}>
            <CircularProgress />
        </Box>
    );
}
