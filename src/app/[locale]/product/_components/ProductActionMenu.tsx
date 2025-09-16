import { IconButton, Menu, MenuItem } from '@mui/material';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { useTranslations } from 'use-intl';
import { encodeBase64 } from 'lib/util/Base64Util';
import { useEnv } from 'app/EnvProvider';
import { SubmodelOrIdReference, useCurrentAasContext } from 'components/contexts/CurrentAasContext';
import { useShowError } from 'lib/hooks/UseShowError';
import { AssetAdministrationShell } from 'lib/api/aas/models';
import {
    checkIfInfrastructureHasSerializationEndpoints,
    serializeAasFromInfrastructure,
} from 'lib/services/serialization-service/serializationActions';
import { useAsyncEffect } from 'lib/hooks/UseAsyncEffect';

type ActionMenuProps = {
    readonly aas: AssetAdministrationShell | null;
    readonly submodels: SubmodelOrIdReference[] | null;
    readonly repositoryURL?: string;
    readonly className?: string;
};

export function ActionMenu({ aas, submodels, repositoryURL, className }: ActionMenuProps) {
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
    const navigate = useRouter();
    const t = useTranslations('pages');
    const env = useEnv();
    const { showError } = useShowError();
    const currentAASContext = useCurrentAasContext();
    const [showDownloadButton, setShowDownloadButton] = useState(false);

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
        if (!aas?.id || !currentAASContext.infrastructureName) {
            handleMenuClose();
            return;
        }
        if (!repositoryURL) {
            showError(t('productViewer.actions.downloadErrorNoRepo'));
            handleMenuClose();
            return;
        }
        const submodelIds = Array.isArray(submodels) ? submodels.map((s) => s.id) : [];
        try {
            const response = await serializeAasFromInfrastructure(
                aas?.id,
                submodelIds,
                currentAASContext.infrastructureName,
            );
            if (response.isSuccess && response.result) {
                const url = window.URL.createObjectURL(response.result.blob);
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
        } catch {
            showError(t('productViewer.actions.downloadError'));
        }
        handleMenuClose();
    }

    useAsyncEffect(async () => {
        if (currentAASContext && currentAASContext.infrastructureName) {
            const serializationEndpointAvailable = await checkIfInfrastructureHasSerializationEndpoints(
                currentAASContext.infrastructureName,
            );
            setShowDownloadButton(serializationEndpointAvailable.isSuccess);
        }
    }, []);

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
            <Menu id="product-actions-menu" anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={handleMenuClose}>
                {env.COMPARISON_FEATURE_FLAG && (
                    <MenuItem onClick={startComparison} data-testid="detail-compare-button">
                        {t('productViewer.actions.compareButton')}
                    </MenuItem>
                )}
                {env.PRODUCT_VIEW_FEATURE_FLAG && (
                    <MenuItem onClick={goToAASView} data-testid="detail-aas-view-button">
                        {t('productViewer.actions.toAasView')}
                    </MenuItem>
                )}
                {showDownloadButton && (
                    <MenuItem onClick={downloadAAS} data-testid="detail-download-button">
                        {t('productViewer.actions.download')}
                    </MenuItem>
                )}
            </Menu>
        </>
    );
}
