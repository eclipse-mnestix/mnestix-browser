import { Button, ButtonProps, styled } from '@mui/material';

const StyledLoadingButton = styled(Button)(({ theme }) => ({
    paddingLeft: theme.spacing(1),
    paddingRight: theme.spacing(1),
    minWidth: '3.5rem',
    maxHeight: '3.5rem',
    height: '3.5rem',
    '.MuiButton-endIcon': {
        margin: 0,
    },
}));

const StyledSmallLoadingButton = styled(Button)(({ theme }) => ({
    padding: '.2rem',
    minWidth: '2.5rem',
    maxHeight: '2.5rem',
    height: '2.5rem',
    '.MuiButton-endIcon': {
        margin: 0,
        lineHeight: '.5rem',
        fontSize: '.5rem',
    },
    '&:hover': {
        backgroundColor: theme.palette.primary.main,
        color: theme.palette.background.default,
    },
}));

export function SquaredIconButton(props: ButtonProps) {
    return <StyledLoadingButton variant={props.variant || 'contained'} size={props.size || 'large'} {...props} />;
}

export function SquaredSmallIconButton(props: ButtonProps) {
    return <StyledSmallLoadingButton variant={props.variant || 'contained'} size={props.size || 'large'} {...props} />;
}

export function RoundedIconButton(props: ButtonProps) {
    const size = props.size === 'small' ? '2.5rem' : props.size === 'medium' ? '3rem' : '3.5rem';

    const StyledRoundButton = styled(StyledLoadingButton)(({ theme }) => ({
        backgroundColor: theme.palette.background.default,
        color: theme.palette.primary.main,
        '&:hover': {
            backgroundColor: theme.palette.primary.main,
            color: theme.palette.background.default,
        },
        borderRadius: size,
        height: size,
        minWidth: size,
        maxHeight: size,
    }));
    return <StyledRoundButton variant={props.variant || 'contained'} size={props.size || 'large'} {...props} />;
}
