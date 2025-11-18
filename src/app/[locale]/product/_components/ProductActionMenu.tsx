import { IconButton, Menu, MenuItem } from '@mui/material';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { useTranslations } from 'use-intl';
import { encodeBase64 } from 'lib/util/Base64Util';
import { useEnv } from 'app/EnvProvider';
import { SubmodelOrIdReference } from 'components/contexts/CurrentAasContext';
import { useShowError } from 'lib/hooks/UseShowError';
import { AssetAdministrationShell } from 'lib/api/aas/models';
import { serializeAasFromInfrastructure } from 'lib/services/serialization-service/serializationActions';
import { useNotificationSpawner } from 'lib/hooks/UseNotificationSpawner';

type ActionMenuProps = {
    readonly aas: AssetAdministrationShell | null;
    readonly repositoryUrl?: string;
    readonly infrastructureName?: string;
    readonly submodels: SubmodelOrIdReference[] | null;
    readonly className?: string;
};

export function ActionMenu({ aas, submodels, className, infrastructureName, repositoryUrl }: ActionMenuProps) {
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
    const navigate = useRouter();
    const t = useTranslations('pages');
    const env = useEnv();
    const { spawn } = useNotificationSpawner();
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
            navigate.push(
                `/viewer/${encodeBase64(aas?.id)}?repoUrl=${encodeURIComponent(repositoryUrl || '')}&infrastructure=${infrastructureName || ''}`,
            );
        }
        handleMenuClose();
    };

    async function downloadAAS() {
        if (!aas?.id || !infrastructureName) {
            showError(t('aasViewer.errors.downloadError'));
            return;
        }
        const submodelIds = Array.isArray(submodels) ? submodels.map((s) => s.id) : [];
        try {
            const response = await serializeAasFromInfrastructure(aas?.id, submodelIds, infrastructureName);
            if (response.isSuccess && response.result) {
                const { blob, endpointUrl, infrastructureName: infra } = response.result;
                const url = window.URL.createObjectURL(blob);
                const link = document.createElement('a');
                link.href = url;
                link.setAttribute('download', `${aas?.idShort}.aasx`);
                document.body.appendChild(link);
                link.click();
                link.parentNode?.removeChild(link);
                window.URL.revokeObjectURL(url);

                // Show success message with endpoint information
                spawn({
                    title: t('aasViewer.actions.download'),
                    message: t('aasViewer.messages.downloadSuccess', {
                        endpoint: endpointUrl,
                        infrastructure: infra,
                    }),
                    severity: 'success',
                });
            } else if (!response.isSuccess) {
                showError(response.message);
            }
        } catch {
            showError(t('aasViewer.errors.downloadError'));
        }
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
            <Menu id="product-actions-menu" anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={handleMenuClose}>
                {env.COMPARISON_FEATURE_FLAG && (
                    <MenuItem onClick={startComparison} data-testid="detail-compare-button">
                        {t('productViewer.actions.compareButton')}
                    </MenuItem>
                )}
                {env.EXPERIMENTAL_PRODUCT_VIEW_FEATURE_FLAG && (
                    <MenuItem onClick={goToAASView} data-testid="detail-aas-view-button">
                        {t('productViewer.actions.toAasView')}
                    </MenuItem>
                )}
                <MenuItem onClick={downloadAAS} data-testid="detail-download-button">
                    {t('productViewer.actions.download')}
                </MenuItem>
            </Menu>
        </>
    );
}
