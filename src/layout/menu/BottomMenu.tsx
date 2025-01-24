import { MenuListItem, MenuListItemProps } from 'layout/menu/MenuListItem';
import { FormattedMessage } from 'react-intl';
import { messages } from 'lib/i18n/localization';
import { AccountCircle, AdminPanelSettings, Login, Logout } from '@mui/icons-material';
import { Divider, List, styled } from '@mui/material';
import { MenuHeading } from 'layout/menu/MenuHeading';
import { useAuth } from 'lib/hooks/UseAuth';

const StyledDivider = styled(Divider)(({ theme }) => ({
    borderColor: theme.palette.common.white,
    opacity: 0.3,
}));
export default function BottomMenu(props: { isLoggedIn: boolean; name: string; isAdmin: boolean }) {
    const auth = useAuth();

    const guestBottomMenu: MenuListItemProps[] = [
        {
            label: <FormattedMessage {...messages.mnestix.login} />,
            icon: <Login />,
            onClick: () => auth.login(),
        },
    ];

    const loggedInBottomMenu: MenuListItemProps[] = [
        {
            label: <FormattedMessage {...messages.mnestix.logout} />,
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
                            {props.isAdmin ? <AdminPanelSettings /> : <AccountCircle />}
                            {props.name}
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
