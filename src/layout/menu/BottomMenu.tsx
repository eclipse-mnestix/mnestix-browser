import { MenuListItem, MenuListItemProps } from 'layout/menu/MenuListItem';
import { AccountCircle, AdminPanelSettings, Login, Logout } from '@mui/icons-material';
import { Box, Divider, List, styled } from '@mui/material';
import { MenuHeading } from 'layout/menu/MenuHeading';
import { useAuth } from 'lib/hooks/UseAuth';
import { useTranslations } from 'next-intl';
import { MnestixRole } from 'components/authentication/AllowedRoutes';

const StyledDivider = styled(Divider)(({ theme }) => ({
    borderColor: theme.palette.common.white,
    opacity: 0.3,
}));
export default function BottomMenu(props: { isLoggedIn: boolean; name: string; mnestixRole: MnestixRole }) {
    const auth = useAuth();
    const t = useTranslations('mainMenu');

    const guestBottomMenu: MenuListItemProps[] = [
        {
            label: t('login'),
            icon: <Login />,
            onClick: () => auth.login(),
        },
    ];

    const loggedInBottomMenu: MenuListItemProps[] = [
        {
            label: t('logout'),
            icon: <Logout />,
            onClick: () => auth.logout(),
        },
    ];

    return (
        <>
            <StyledDivider />
            <List>
                {props.isLoggedIn && (
                    <>
                        <MenuHeading marginTop={0}>
                            <Box component="span" display="flex" gap={1}>
                                {props.mnestixRole === MnestixRole.MnestixAdmin ? (
                                    <AdminPanelSettings />
                                ) : (
                                    <AccountCircle />
                                )}
                                {props.name}
                            </Box>
                        </MenuHeading>
                        {loggedInBottomMenu.map((props, i) => (
                            <MenuListItem {...props} key={'adminBottomMenu' + i} />
                        ))}
                    </>
                )}
                {!props.isLoggedIn && (
                    <>
                        {guestBottomMenu.map((props, i) => (
                            <MenuListItem {...props} key={'guestBottomMenu' + i} />
                        ))}
                    </>
                )}
            </List>
        </>
    );
}
