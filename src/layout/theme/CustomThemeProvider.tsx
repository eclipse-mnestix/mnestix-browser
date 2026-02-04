'use client';
import { PropsWithChildren, useState } from 'react';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { theme as defaultTheme } from './theme';
import { deDE } from '@mui/material/locale';
import { CssBaseline, Theme, ThemeOptions } from '@mui/material';
import { useAsyncEffect } from 'lib/hooks/UseAsyncEffect';
import { useEnv } from 'app/EnvProvider';
import { DefaultThemeSettings } from 'layout/theme/DefaultTheme';

export function CustomThemeProvider(props: PropsWithChildren<{ readonly skipStyleReset?: boolean }>) {
    const [muiTheme, setMuiTheme] = useState<Theme>(createTheme(defaultTheme, deDE));
    const env = useEnv();

    useAsyncEffect(async () => {
        const theme: ThemeOptions = { ...defaultTheme };
        if (!theme.palette) return;

        theme.palette.primary = { main: env.THEME_PRIMARY_COLOR ?? DefaultThemeSettings.primaryColor };
        theme.palette.secondary = { main: env.THEME_SECONDARY_COLOR ?? DefaultThemeSettings.secondaryColor };

        if (env.THEME_LOGO_URL) {
            theme.productLogo = { logo: env.THEME_LOGO_URL };
        } else if (env.THEME_BASE64_LOGO) {
            theme.productLogo = { logo: env.THEME_BASE64_LOGO };
        }

        theme.customColors = {
            ...theme.customColors,
            menuBackground: {
                main: env.THEME_MENU_COLOR ?? env.THEME_PRIMARY_COLOR ?? DefaultThemeSettings.primaryColor,
            },
        };

        setMuiTheme(createTheme(theme, deDE));
    }, [env]);

    return (
        <>
            <ThemeProvider theme={muiTheme}>
                {!props.skipStyleReset && <CssBaseline />}
                {props.children}
            </ThemeProvider>
        </>
    );
}
