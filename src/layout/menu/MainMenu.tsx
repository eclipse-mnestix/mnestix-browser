import MenuIcon from '@mui/icons-material/Menu';
import { alpha, Box, Divider, Drawer, IconButton, List, styled, Typography } from '@mui/material';
import { Dashboard, OpenInNew, Settings } from '@mui/icons-material';
import React, { useState } from 'react';
import { useAuth } from 'lib/hooks/UseAuth';
import { TemplateIcon } from 'components/custom-icons/TemplateIcon';
import { MenuHeading } from './MenuHeading';
import { MenuListItem, MenuListItemProps } from './MenuListItem';
import ListIcon from '@mui/icons-material/List';
import packageJson from '../../../package.json';
import { useEnv } from 'app/EnvProvider';
import BottomMenu from 'layout/menu/BottomMenu';
import { useTranslations } from 'next-intl';
import { MnestixRole } from 'components/authentication/AllowedRoutes';

const StyledDrawer = styled(Drawer)(({ theme }) => ({
    '.MuiDrawer-paper': {
        color: theme.palette.primary.contrastText,
        background: theme.customColors?.menuBackground?.main ?? theme.palette.primary.main,
        width: '275px',
        paddingTop: theme.mixins.toolbar.minHeight,
        '.MuiListItem-root, .MuiListItemButton-root': {
            '.MuiTypography-root': {
                textOverflow: 'ellipsis',
                overflow: 'hidden',
            },
        },
        '.MuiListItemButton-root': {
            color: theme.palette.primary.contrastText,
            '&:hover': {
                backgroundColor: alpha(theme.customColors?.menuBackground?.main ?? theme.palette.primary.main, 0.8),
            },
            '&:focus': {
                backgroundColor: 'transparent',
            },
            '&.active': {
                backgroundColor: theme.palette.primary.light,
            },
        },
        '.MuiListItemIcon-root': {
            color: alpha(theme.palette.primary.contrastText, 0.8),
        },
        '.bottom-menu': {
            marginTop: 'auto',
        },
    },
    '.MuiBackdrop-root': {
        background: 'none',
    },
}));

const StyledDivider = styled(Divider)(({ theme }) => ({
    borderColor: theme.palette.common.white,
    opacity: 0.3,
}));

export default function MainMenu() {
    const [drawerOpen, setDrawerOpen] = useState(false);
    const auth = useAuth();
    const env = useEnv();
    const useAuthentication = env.AUTHENTICATION_FEATURE_FLAG;
    const versionString = 'Version ' + packageJson.version;
    const mnestixRole = auth.getAccount()?.user.mnestixRole ?? MnestixRole.MnestixGuest;
    const allowedRoutes = auth.getAccount()?.user.allowedRoutes ?? [];
    const t = useTranslations('navigation.mainMenu');

    const getAuthName = () => {
        const user = auth?.getAccount()?.user;
        if (!user) return;
        if (user.email) return user.email;
        if (user.name) return user.name;
        return;
    };

    const handleMenuInteraction = (open: boolean) => (event: React.KeyboardEvent | React.MouseEvent) => {
        if (
            event.type === 'keydown' &&
            ((event as React.KeyboardEvent).key === 'Tab' || (event as React.KeyboardEvent).key === 'Shift')
        ) {
            return;
        }
        setDrawerOpen(open);
    };

    const checkIfRouteIsAllowed = (route: string) => {
        return (useAuthentication && auth.isLoggedIn && allowedRoutes.includes(route)) || !useAuthentication;
    };

    const basicMenu: MenuListItemProps[] = [
        {
            label: t('dashboard'),
            to: '/',
            icon: <Dashboard />,
        },
    ];

    if (env.AAS_LIST_FEATURE_FLAG) {
        const listItemToAdd = {
            label: t('aasList'),
            to: '/list',
            icon: <ListIcon />,
        };
        basicMenu.push(listItemToAdd);
    }

    if (env.MNESTIX_AAS_GENERATOR_API_URL && checkIfRouteIsAllowed('/templates')) {
        const templateItemToAdd = {
            label: t('templates'),
            to: '/templates',
            icon: <TemplateIcon data-testid="templates-menu-icon" />,
        };
        basicMenu.push(templateItemToAdd);
    }

    if (checkIfRouteIsAllowed('/settings')) {
        const settingsMenu = {
            label: t('settings'),
            to: '/settings',
            icon: <Settings data-testid="settings-menu-icon" />,
        };
        basicMenu.push(settingsMenu);
    }

    const guestMoreMenu: MenuListItemProps[] = [
        {
            label: 'mnestix.io',
            to: 'https://mnestix.io/',
            target: '_blank',
            external: true,
            icon: <OpenInNew />,
        },
    ];

    return (
        <>
            <IconButton
                color={'inherit'}
                sx={{ m: 1, zIndex: 1 }}
                onClick={drawerOpen ? handleMenuInteraction(false) : handleMenuInteraction(true)}
                data-testid="header-burgermenu"
            >
                <MenuIcon />
            </IconButton>
            <StyledDrawer anchor="left" open={drawerOpen} onClose={handleMenuInteraction(false)}>
                <Box
                    onClick={handleMenuInteraction(false)}
                    onKeyDown={handleMenuInteraction(false)}
                    data-testid="main-menu"
                >
                    <List>
                        <MenuHeading>{t('repository')}</MenuHeading>
                        <>
                            {basicMenu.map((props, i) => (
                                <MenuListItem {...props} key={'adminMainMenu' + i} />
                            ))}
                        </>
                        {useAuthentication && !auth.isLoggedIn && (
                            <>
                                <StyledDivider />
                                <MenuHeading>{t('findOutMore')}</MenuHeading>
                                {guestMoreMenu.map((props, i) => (
                                    <MenuListItem {...props} key={'guestMoreMenu' + i} />
                                ))}
                            </>
                        )}
                    </List>
                </Box>
                <Box sx={{ mt: 'auto', mb: 0, p: '16px', opacity: 0.6 }}>
                    <Typography>{versionString}</Typography>
                </Box>
                {useAuthentication && (
                    <BottomMenu mnestixRole={mnestixRole} name={getAuthName() ?? ''} isLoggedIn={auth.isLoggedIn} />
                )}
            </StyledDrawer>
        </>
    );
}
