import { Delete, Edit, MoreVert } from '@mui/icons-material';
import { Box, Divider, IconButton, ListItemIcon, Menu, MenuItem, styled, Typography } from '@mui/material';
import { IconCircleWrapper } from 'components/basics/IconCircleWrapper';
import { TemplateIcon } from 'components/custom-icons/TemplateIcon';
import React, { useState } from 'react';
import { TemplateDeleteDialog } from './TemplateDeleteDialog';
import { useRouter } from 'next/navigation';
import { useTranslations } from 'next-intl';

export type CustomTemplateItemType = {
    id?: string;
    displayName: string | null;
    basedOnTemplate?: string;
    basedOnTemplateId?: string;
};

interface CustomTemplateItemProps {
    item: CustomTemplateItemType;
    hasDivider?: boolean;
    onDelete?: () => void;
}

const StyledCustomTemplateItem = styled(Box)(({ theme }) => ({
    display: 'flex',
    alignItems: 'center',
    padding: theme.spacing(2),
    cursor: 'pointer',

    '.more-button': {
        display: 'none',
        marginLeft: 'auto',
    },

    '&:hover, &.active': {
        backgroundColor: theme.palette.action.hover,
        '.more-button': {
            display: 'flex',
        },
    },
}));

export function CustomTemplateItem(props: CustomTemplateItemProps) {
    const navigate = useRouter();
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
    const menuOpen = Boolean(anchorEl);
    const t = useTranslations('pages.templates');

    const handleMenuClick = (event: React.MouseEvent<HTMLElement>) => {
        event.nativeEvent.stopImmediatePropagation();
        event.stopPropagation();
        setAnchorEl(event.currentTarget);
    };
    const handleMenuClose = (event: React.MouseEvent<HTMLElement>) => {
        event.nativeEvent.stopImmediatePropagation();
        event.stopPropagation();
        setAnchorEl(null);
    };

    const handleEditClick = (event: React.MouseEvent<HTMLElement>) => {
        handleMenuClose(event);
        navigateToTemplate();
    };

    const handleDeleteClick = (event: React.MouseEvent<HTMLElement>) => {
        handleMenuClose(event);
        openDialog();
    };

    const openDialog = () => {
        setDeleteDialogOpen(true);
    };

    const closeDialog = () => {
        setDeleteDialogOpen(false);
    };

    const deleteTemplate = () => {
        closeDialog();
        if (props.onDelete) {
            props.onDelete();
        }
    };

    const navigateToTemplate = () => {
        if (props.item.id) {
            navigate.push(`/templates/${encodeURIComponent(props.item.id)}`);
        }
    };
    return (
        <>
            <StyledCustomTemplateItem onClick={navigateToTemplate} className={menuOpen ? 'active' : ''}>
                <Box sx={{ mr: 2 }}>
                    <IconCircleWrapper>
                        <TemplateIcon fontSize="small" />
                    </IconCircleWrapper>
                </Box>
                <Box>
                    <Typography variant="h4">{props.item.displayName}</Typography>
                    <Typography variant="body2" color="text.secondary">
                        {props.item.basedOnTemplate}
                    </Typography>
                </Box>
                <IconButton onClick={handleMenuClick} className="more-button">
                    <MoreVert />
                </IconButton>
                <Menu anchorEl={anchorEl} open={menuOpen} onClose={handleMenuClose}>
                    <MenuItem onClick={handleEditClick}>
                        <ListItemIcon>
                            <Edit fontSize="small" />
                        </ListItemIcon>
                        {t('actions.edit')}
                    </MenuItem>
                    <MenuItem onClick={handleDeleteClick}>
                        <ListItemIcon>
                            <Delete fontSize="small" />
                        </ListItemIcon>
                        {t('actions.delete')}
                    </MenuItem>
                </Menu>
            </StyledCustomTemplateItem>
            {props.hasDivider !== false && <Divider />}
            <TemplateDeleteDialog
                open={deleteDialogOpen}
                onClose={closeDialog}
                onDelete={deleteTemplate}
                itemName={props.item.displayName}
            />
        </>
    );
}
