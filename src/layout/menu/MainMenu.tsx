import MenuIcon from '@mui/icons-material/Menu';
import { alpha, Box, Divider, Drawer, IconButton, List, styled, Typography } from '@mui/material';
import { Dashboard, Login, Logout, OpenInNew, Settings } from '@mui/icons-material';
import React, { useState } from 'react';
import { useAuth } from 'lib/hooks/UseAuth';
import { FormattedMessage } from 'react-intl';
import { messages } from 'lib/i18n/localization';
import { TemplateIcon } from 'components/custom-icons/TemplateIcon';
import { MenuHeading } from './MenuHeading';
import { MenuListItem, MenuListItemProps } from './MenuListItem';
import ListIcon from '@mui/icons-material/List';
import packageJson from '../../../package.json';
import { useEnv } from 'app/env/provider';

const StyledDrawer = styled(Drawer)(({ theme }) => ({
    '.MuiDrawer-paper': {
        color: theme.palette.primary.contrastText,
        background: theme.palette.primary.main,
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
                backgroundColor: alpha(theme.palette.primary.dark, 0.8),
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

    const adminMainMenu: MenuListItemProps[] = [
        {
            label: <FormattedMessage {...messages.mnestix.dashboard} />,
            to: '/',
            icon: <Dashboard />,
        },
        {
            label: <FormattedMessage {...messages.mnestix.settings} />,
            to: '/settings',
            icon: <Settings />,
        },
    ];

    const adminBottomMenu: MenuListItemProps[] = [
        {
            label: <FormattedMessage {...messages.mnestix.logout} />,
            icon: <Logout />,
            onClick: () => auth.logout(),
        },
    ];

    const guestMainMenu: MenuListItemProps[] = [
        {
            label: <FormattedMessage {...messages.mnestix.dashboard} />,
            to: '/',
            icon: <Dashboard />,
        },
    ];

    const guestMoreMenu: MenuListItemProps[] = [
        {
            label: 'mnestix.io',
            to: 'https://mnestix.io/',
            target: '_blank',
            external: true,
            icon: <OpenInNew />,
        },
    ];

    const guestBottomMenu: MenuListItemProps[] = [
        {
            label: <FormattedMessage {...messages.mnestix.login} />,
            icon: <Login />,
            onClick: () => auth.login(),
        },
    ];

    if (env.AAS_LIST_FEATURE_FLAG) {
        const listItemToAdd = {
            label: <FormattedMessage {...messages.mnestix.list} />,
            to: '/list',
            icon: <ListIcon />,
        };
        
        adminMainMenu.splice(1, 0, listItemToAdd);
    }

    if (env.MNESTIX_BACKEND_API_URL) {
        const templateItemToAdd = {
            label: <FormattedMessage {...messages.mnestix.templates} />,
            to: '/templates',
            icon: <TemplateIcon />,
        };

        adminMainMenu.push(templateItemToAdd);
    }

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
                <Box onClick={handleMenuInteraction(false)} onKeyDown={handleMenuInteraction(false)}>
                    <List>
                        <MenuHeading>
                            <FormattedMessage {...messages.mnestix.repository} />
                        </MenuHeading>
                        {!useAuthentication || auth.isLoggedIn ? (
                            <>
                                {adminMainMenu.map((props, i) => (
                                    <MenuListItem {...props} key={'adminMainMenu' + i} />
                                ))}
                            </>
                        ) : (
                            <>
                                {guestMainMenu.map((props, i) => (
                                    <MenuListItem {...props} key={'guestMainMenu' + i} />
                                ))}
                                <StyledDivider />
                                <MenuHeading>
                                    <FormattedMessage {...messages.mnestix.findOutMore} />
                                </MenuHeading>
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
                    <>
                        <StyledDivider />
                        <List>
                            {auth.isLoggedIn && (
                                <>
                                    {getAuthName() && <MenuHeading marginTop={0}>{getAuthName()}</MenuHeading>}
                                    {adminBottomMenu.map((props, i) => (
                                        <MenuListItem {...props} key={'adminBottomMenu' + i} />
                                    ))}
                                </>
                            )}
                            {!auth.isLoggedIn && (
                                <>
                                    {guestBottomMenu.map((props, i) => (
                                        <MenuListItem {...props} key={'guestBottomMenu' + i} />
                                    ))}
                                </>
                            )}
                        </List>
                    </>
                )}
            </StyledDrawer>
        </>
    );
}
