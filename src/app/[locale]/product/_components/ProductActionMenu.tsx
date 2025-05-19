import { IconButton, Menu, MenuItem } from '@mui/material';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { useTranslations } from 'use-intl';
import { encodeBase64 } from 'lib/util/Base64Util';
import { useEnv } from 'app/EnvProvider';
import { SubmodelOrIdReference } from 'components/contexts/CurrentAasContext';
import { downloadAasFromRepo } from 'lib/services/repository-access/repositorySearchActions';
import { useShowError } from 'lib/hooks/UseShowError';
import { AssetAdministrationShell } from '@aas-core-works/aas-core3.0-typescript/types';

type ActionMenuProps = {
    readonly aas: AssetAdministrationShell | null;
    readonly submodels: SubmodelOrIdReference[] | null;
    readonly repositoryURL: string | null;
    readonly className?: string;
};

export function ActionMenu({ aas, submodels, repositoryURL, className }: ActionMenuProps) {
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
    const navigate = useRouter();
    const t = useTranslations('pages');
    const env = useEnv();
    const { showError } = useShowError();

    const handleMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
        setAnchorEl(event.currentTarget);
    };

    const handleMenuClose = () => {
        setAnchorEl(null);
    };

    const startComparison = () => {
        if (aas?.id) {
            navigate.push(`/compare?aasId=${encodeURIComponent(aas?.id)}`);
        }
        handleMenuClose();
    };

    const goToAASView = () => {
        if (aas?.id) {
            navigate.push(`/viewer/${encodeBase64(aas?.id)}`);
        }
        handleMenuClose();
    };

    async function downloadAAS() {
        if (!aas?.id) {
            handleMenuClose();
            return;
        }
        if (!repositoryURL) {
            showError(t('productViewer.actions.downloadErrorNoRepo'));
            handleMenuClose();
            return;
        }
        const submodelIds =
            Array.isArray(submodels)
                ? submodels.map(s => s.id)
                : [];
        try {
            const response = await downloadAasFromRepo(aas?.id, submodelIds, repositoryURL);
            if (response.isSuccess && response.result) {
                const url = window.URL.createObjectURL(response.result);
                const link = document.createElement('a');
                link.href = url;
                link.setAttribute('download', `${aas?.idShort}.aasx`);
                document.body.appendChild(link);
                link.click();
                link.parentNode?.removeChild(link);
                window.URL.revokeObjectURL(url);
            } else if (!response.isSuccess) {
                showError(response.message);
            }
        } catch (e) {
            showError(t('productViewer.actions.downloadError'));
        }
        handleMenuClose();
    }

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
                <MenuItem 
                        onClick={downloadAAS} 
                        data-testid="detail-download-button"
                    >
                        {t('productViewer.actions.download')}
                    </MenuItem>
            </Menu>
        </>
    );
}