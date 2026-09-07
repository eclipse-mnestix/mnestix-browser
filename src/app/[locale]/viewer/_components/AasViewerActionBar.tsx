'use client';

import { Box, Button, IconButton, Menu, MenuItem } from '@mui/material';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import Link from 'next/link';
import { useTranslations } from 'next-intl';
import { useState } from 'react';
import type { AasViewerAction } from 'components/visualizations/viewer.types';

/**
 * Presentational action bar for the AAS viewer. Renders an ordered list of
 * {@link AasViewerAction}: the first action is primary (contained), the second
 * secondary (outlined), and the rest fold into a ⋮ overflow menu. Actions with
 * an `href` render as navigation links; actions with an `onClick` render as
 * buttons. The concrete viewers compute the action list (typically via
 * {@link useAasViewerActions}) and pass it in.
 */
export function AasViewerActionBar({ actions }: { actions: AasViewerAction[] }) {
    const t = useTranslations();
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

    // Labels may be i18n keys (OSS config) or raw display strings (custom
    // overrides), so bypass next-intl's compile-time key typing here.
    const looseT = t as unknown as ((key: string) => string) & { has: (key: string) => boolean };

    function resolveLabel(label: string) {
        return looseT.has(label) ? looseT(label) : label;
    }

    const primaryAction = actions[0] ?? null;
    const secondaryAction = actions[1] ?? null;
    const menuActions = actions.slice(2);

    if (!primaryAction && menuActions.length === 0) {
        return null;
    }

    function renderAction(action: AasViewerAction, variant: 'contained' | 'outlined') {
        if (action.href) {
            return (
                <Button key={action.label} variant={variant} component={Link} href={action.href}>
                    {resolveLabel(action.label)}
                </Button>
            );
        }
        return (
            <Button key={action.label} variant={variant} onClick={action.onClick}>
                {resolveLabel(action.label)}
            </Button>
        );
    }

    return (
        <Box
            sx={{
                display: 'flex',
                justifyContent: 'flex-end',
                alignItems: 'center',
                gap: 1,
                flex: '0 0 auto',
            }}
        >
            {primaryAction && renderAction(primaryAction, 'contained')}
            {secondaryAction && renderAction(secondaryAction, 'outlined')}
            {menuActions.length > 0 && (
                <>
                    <IconButton
                        aria-label="more actions"
                        aria-controls="aas-view-menu"
                        aria-haspopup="true"
                        onClick={(e) => setAnchorEl(e.currentTarget)}
                        data-testid="aas-view-menu-button"
                    >
                        <MoreVertIcon />
                    </IconButton>
                    <Menu
                        id="aas-view-menu"
                        anchorEl={anchorEl}
                        open={Boolean(anchorEl)}
                        onClose={() => setAnchorEl(null)}
                    >
                        {menuActions.map((action) =>
                            action.href ? (
                                <MenuItem
                                    key={action.label}
                                    component={Link}
                                    href={action.href}
                                    onClick={() => setAnchorEl(null)}
                                >
                                    {resolveLabel(action.label)}
                                </MenuItem>
                            ) : (
                                <MenuItem
                                    key={action.label}
                                    onClick={() => {
                                        setAnchorEl(null);
                                        action.onClick?.();
                                    }}
                                >
                                    {resolveLabel(action.label)}
                                </MenuItem>
                            ),
                        )}
                    </Menu>
                </>
            )}
        </Box>
    );
}