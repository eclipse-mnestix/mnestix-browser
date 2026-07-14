import { Link } from '@mui/icons-material';
import { alpha, Box, styled, Typography } from '@mui/material';

type DynamicPartTextProps = {
    readonly text?: string;
    readonly variant?: 'reference' | 'regular';
};

const StyledWrapper = styled(Box)<{ variant?: string }>(({ theme, variant }) => ({
    display: 'inline-block',
    margin: '0 2px',
    padding: '1px 3px',
    borderRadius: '5px',
    // backgroundColor: alpha(theme.palette.secondary.main, 0.1),
    backgroundColor:
        variant === 'regular' ? alpha(theme.palette.primary.main, 0.1) : alpha(theme.palette.secondary.main, 0.1),
}));

export function DynamicPartText(props: DynamicPartTextProps) {
    if (!props.text) {
        return <></>;
    }
    return (
        <StyledWrapper variant={props.variant}>
            {props.variant === 'regular' ? (
                <Typography color="primary" sx={{ fontWeight: 'bold' }}>
                    {props.text}
                </Typography>
            ) : (
                <Box
                    sx={{
                        display: 'flex',
                        alignItems: 'center'
                    }}>
                    <Link color="secondary" sx={{
                        fontSize: 'small'
                    }} />
                    <Typography color="secondary" sx={{ fontWeight: 'bold' }}>
                        {props.text}
                    </Typography>
                </Box>
            )}
        </StyledWrapper>
    );
}
