'use client';

import { Box, Button, IconButton, Menu, MenuItem } from '@mui/material';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import Link from 'next/link';
import { useParams, useSearchParams } from 'next/navigation';
import { useTranslations } from 'next-intl';
import { useState } from 'react';
import { getAasViewerConfig } from 'app/[locale]/viewer/_visualizations/viewer.config';
import { useEnv } from 'app/EnvProvider';
import { useCurrentAasContext } from 'components/contexts/CurrentAasContext';
import { useShowError } from 'lib/hooks/UseShowError';
import { useNotificationSpawner } from 'lib/hooks/UseNotificationSpawner';
import { useAsyncEffect } from 'lib/hooks/UseAsyncEffect';
import {
    checkIfInfrastructureHasSerializationEndpoints,
    serializeAasFromInfrastructure,
} from 'lib/services/serialization-service/serializationActions';

/**
 * Top-right action bar for the AAS viewer. Hoists the download action out of the
 * concrete viewers so it persists across view switches, and replaces the Tabs
 * switcher with an ordered set of view buttons: the first action is primary, the
 * second secondary, and the rest fold into a ⋮ overflow menu. Views are the
 * `switchable` set from {@link getAasViewerConfig} minus the current one.
 */
export function AasViewerActionBar() {
    const params = useParams<{ base64AasId: string; view?: string }>();
    const searchParams = useSearchParams();
    const t = useTranslations();
    const env = useEnv();
    const { showError } = useShowError();
    const { spawn } = useNotificationSpawner();
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
    const [showDownloadButton, setShowDownloadButton] = useState(false);

    const aasViewerConfig = getAasViewerConfig(env);
    const { aas, submodels, infrastructureName } = useCurrentAasContext();

    const currentView = params.view ?? aasViewerConfig.default;

    useAsyncEffect(async () => {
        if (infrastructureName) {
            const serializationEndpointAvailable =
                await checkIfInfrastructureHasSerializationEndpoints(infrastructureName);
            setShowDownloadButton(serializationEndpointAvailable.isSuccess);
        }
    }, [infrastructureName]);

    async function downloadAAS() {
        if (!aas?.id || !infrastructureName) {
            showError(t('pages.aasViewer.errors.downloadError'));
            return;
        }
        const submodelIds = Array.isArray(submodels) ? submodels.map((s) => s.id) : [];
        try {
            const response = await serializeAasFromInfrastructure(aas.id, submodelIds, infrastructureName);
            if (response.isSuccess && response.result) {
                const { blob, endpointUrl, infrastructureName: infra } = response.result;
                const url = window.URL.createObjectURL(blob);
                const link = document.createElement('a');
                link.href = url;
                link.setAttribute('download', `${aas.idShort}.aasx`);
                document.body.appendChild(link);
                link.click();
                link.parentNode?.removeChild(link);
                window.URL.revokeObjectURL(url);

                spawn({
                    title: t('pages.aasViewer.actions.download'),
                    message: t('pages.aasViewer.messages.downloadSuccess', { endpoint: endpointUrl, infrastructure: infra }),
                    severity: 'success',
                });
            } else if (!response.isSuccess) {
                showError(response.message);
            }
        } catch {
            showError(t('pages.aasViewer.errors.downloadError'));
        }
    }

    const query = searchParams.toString();
    const suffix = query ? `?${query}` : '';

    // Labels may be i18n keys (OSS config) or raw display strings (custom
    // overrides), so bypass next-intl's compile-time key typing here.
    const looseT = t as unknown as ((key: string) => string) & { has: (key: string) => boolean };

    function resolveLabel(label: string) {
        return looseT.has(label) ? looseT(label) : label;
    }

    const otherViews = aasViewerConfig.switchable.filter((key) => key !== currentView);

    // Actions in display order: download first, then the other views. If there
    // is no download action (no serialization endpoint), the views shift left
    // and the first becomes the primary action.
    const primaryAction = showDownloadButton ? 'download' : otherViews[0] ?? null;
    const menuViews = showDownloadButton ? otherViews.slice(1) : otherViews.slice(2);

    if (!primaryAction && menuViews.length === 0) {
        return null;
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
            {primaryAction === 'download' && (
                <Button variant="contained" onClick={downloadAAS} data-testid="aas-download-button">
                    {t('pages.aasViewer.actions.download')}
                </Button>
            )}
            {primaryAction !== 'download' && primaryAction && (
                <Button
                    variant="contained"
                    component={Link}
                    href={`/viewer/${params.base64AasId}/${primaryAction}${suffix}`}
                    data-testid={`aas-view-button-${primaryAction}`}
                >
                    {resolveLabel(aasViewerConfig.views[primaryAction].label)}
                </Button>
            )}
            {otherViews.slice(showDownloadButton ? 0 : 1, showDownloadButton ? 1 : 2).map((key) => (
                <Button
                    key={key}
                    variant="outlined"
                    component={Link}
                    href={`/viewer/${params.base64AasId}/${key}${suffix}`}
                    data-testid={`aas-view-button-${key}`}
                >
                    {resolveLabel(aasViewerConfig.views[key].label)}
                </Button>
            ))}
            {menuViews.length > 0 && (
                <>
                    <IconButton
                        aria-label="more views"
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
                        {menuViews.map((key) => (
                            <MenuItem
                                key={key}
                                component={Link}
                                href={`/viewer/${params.base64AasId}/${key}${suffix}`}
                                onClick={() => setAnchorEl(null)}
                                data-testid={`aas-view-menu-item-${key}`}
                            >
                                {resolveLabel(aasViewerConfig.views[key].label)}
                            </MenuItem>
                        ))}
                    </Menu>
                </>
            )}
        </Box>
    );
}