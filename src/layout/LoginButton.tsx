import { MnestixRole } from 'components/authentication/AllowedRoutes';
import { MenuHeading } from './menu/MenuHeading';
import { Box } from '@mui/system';
import { AccountCircle, AdminPanelSettings, Login, Logout } from '@mui/icons-material';
import { MenuListItem, MenuListItemProps } from './menu/MenuListItem';
import { useTranslations } from 'next-intl';
import { useAuth } from 'lib/hooks/UseAuth';

export default function LoginButton(props: { isLoggedIn: boolean; name: string; mnestixRole: MnestixRole }) {
    const auth = useAuth();
    const t = useTranslations('navigation.mainMenu');

    const loggedInButtonContent: MenuListItemProps[] = [
        {
            label: t('logout'),
            icon: <Logout data-testid="logout-button" />,
            onClick: () => auth.logout(),
        },
    ];

    const guestButtonContent: MenuListItemProps[] = [
        {
            label: t('login'),
            icon: <Login data-testid="login-button" />,
            onClick: () => auth.login(),
        },
    ];

    return (
        <>
            {props.isLoggedIn && (
                <>
                    <MenuHeading marginTop={0}>
                        <Box component="span" display="flex" gap={1} data-testid="user-info-box" maxWidth={100}>
                            {props.mnestixRole === MnestixRole.MnestixAdmin ? (
                                <AdminPanelSettings data-testid="admin-icon" />
                            ) : (
                                <AccountCircle data-testid="user-icon" />
                            )}
                            {props.name}
                        </Box>
                    </MenuHeading>
                    {loggedInButtonContent.map((props, i) => (
                        <MenuListItem {...props} key={'adminLoginStateButton' + i} />
                    ))}
                </>
            )}
            {!props.isLoggedIn && (
                <div style={{ maxWidth: 250 }}>
                    {guestButtonContent.map((props, i) => (
                        <MenuListItem {...props} key={'guestLoginStateButton' + i} />
                    ))}
                </div>
            )}
        </>
    );
}
