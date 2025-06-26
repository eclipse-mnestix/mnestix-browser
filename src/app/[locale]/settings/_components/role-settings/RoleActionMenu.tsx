import { IconButton, Menu, MenuItem } from '@mui/material';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import { useState } from 'react';
import { useTranslations } from 'use-intl';
import { red } from '@mui/material/colors';

export function RoleActionMenu({
    roleName,
    openCreateDialog,
    openDeleteRoleDialog,
}: {
    roleName: string;
    openCreateDialog: (roleName: string | null) => void;
    openDeleteRoleDialog: (roleName: string) => void;
}) {
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
    const t = useTranslations('pages.settings.rules');

    const handleMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
        setAnchorEl(event.currentTarget);
    };

    const handleMenuClose = () => {
        setAnchorEl(null);
    };

    return (
        <>
            <IconButton onClick={handleMenuOpen}>
                <MoreVertIcon />
            </IconButton>
            <Menu id="role-actions-menu" anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={handleMenuClose}>
                <MenuItem onClick={() => openCreateDialog(roleName)} data-testid="create-rule-menu-item">
                    {t('createRule.title')}
                </MenuItem>
                <MenuItem
                    sx={{ color: red[500] }}
                    onClick={() => openDeleteRoleDialog(roleName)}
                    data-testid="delete-role-menu-item"
                >
                    {t('deleteRole.delete')}
                </MenuItem>
            </Menu>
        </>
    );
}
