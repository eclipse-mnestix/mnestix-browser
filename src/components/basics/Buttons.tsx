import { Button, ButtonProps, styled } from '@mui/material';

const StyledLoadingButton = styled(Button)(({ theme }) => ({
    paddingLeft: theme.spacing(1),
    paddingRight: theme.spacing(1),
    minWidth: '56px',
    maxHeight: '56px',
    height: '56px',
    '.MuiButton-endIcon': {
        margin: 0,
    },
}));

export function SquaredIconButton(props: ButtonProps) {
    return <StyledLoadingButton variant={props.variant || 'contained'} size={props.size || 'large'} {...props} />;
}

export function RoundedIconButton(props: ButtonProps) {
    const StyledRoundButton = styled(StyledLoadingButton)(({ theme }) => ({
        backgroundColor: theme.palette.background.default,
        color: theme.palette.primary.main,
        '&:hover': {
            backgroundColor: theme.palette.primary.main,
            color: theme.palette.background.default,
        },
    }));
    return (
        <StyledRoundButton
            variant={props.variant || 'contained'}
            size={props.size || 'large'}
            style={{ borderRadius: '56px' }}
            {...props}
        />
    );
}
