import { useMediaQuery } from '@mui/material';
import { useTheme } from '@mui/material/styles';

const mobileBreakpoint = 'md';

/** Returns a value indicating whether the app is currently being viewed on a mobile device. */
export function useIsMobile() {
    const theme = useTheme();
    return !useMediaQuery(theme.breakpoints.up(mobileBreakpoint), { noSsr: true });
}
