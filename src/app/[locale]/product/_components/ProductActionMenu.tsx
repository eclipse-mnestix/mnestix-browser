import { IconButton, Menu, MenuItem } from '@mui/material';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { useTranslations } from 'use-intl';
import { encodeBase64 } from 'lib/util/Base64Util';
import { useEnv } from 'app/EnvProvider';

type ActionMenuProps = {
    readonly aasId?: string;
    readonly className?: string;
};

export function ActionMenu({ aasId, className }: ActionMenuProps) {
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
    const navigate = useRouter();
    const t = useTranslations('pages');
    const env = useEnv();

    const handleMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
        setAnchorEl(event.currentTarget);
    };

    const handleMenuClose = () => {
        setAnchorEl(null);
    };

    const startComparison = () => {
        if (aasId) {
            navigate.push(`/compare?aasId=${encodeURIComponent(aasId)}`);
        }
        handleMenuClose();
    };

    const goToAASView = () => {
        if (aasId) {
            navigate.push(`/viewer/${encodeBase64(aasId)}`);
        }
        handleMenuClose();
    };

    return (
        <>
            <IconButton
                aria-label="more actions"
                aria-controls="product-actions-menu"
                aria-haspopup="true"
                onClick={handleMenuOpen}
                className={className}
                data-testid="product-actions-menu-button"
            >
                <MoreVertIcon />
            </IconButton>
            <Menu
                id="product-actions-menu"
                anchorEl={anchorEl}
                open={Boolean(anchorEl)}
                onClose={handleMenuClose}
            >
                {env.COMPARISON_FEATURE_FLAG && (
                    <MenuItem 
                        onClick={startComparison} 
                        data-testid="detail-compare-button"
                    >
                        {t('productViewer.actions.compareButton')}
                    </MenuItem>
                )}
                {env.PRODUCT_VIEW_FEATURE_FLAG && (
                    <MenuItem 
                        onClick={goToAASView}
                        data-testid="detail-aas-view-button"
                    >
                        {t('productViewer.actions.toAasView')}
                    </MenuItem>
                )}
            </Menu>
        </>
    );
}