import { styled, useTheme } from '@mui/material';
import Logo from '../../assets/logo.svg';

// May be extended with monochrome, reduced or other needed variants

type MnestixLogoProps = {
    readonly width?: string;
    readonly height?: string;
};

// Styling
const StyledLogo = styled(Logo)<{ width?: string; height?: string }>(({ width, height }) => ({
    maxWidth: '100%',
    maxHeight: '100%',
    width: width ?? '100%',
    height: height ?? 'auto',
    display: 'block',
}));

export function MnestixLogo(props: MnestixLogoProps) {
    // Differentiate between the logo variants
    const theme = useTheme();
    const color = theme.palette.common.white;

    return <StyledLogo width={props.width} height={props.height} color={color} />;
}
