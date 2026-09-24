'use client';

import { useParams, useSearchParams } from 'next/navigation';
import { useTranslations } from 'next-intl';
import { getAasViewerConfig } from 'app/[locale]/viewer/_visualizations/viewer.config';
import { useEnv } from 'app/EnvProvider';
import { useCurrentAasContext } from 'components/contexts/CurrentAasContext';
import { useShowError } from 'lib/hooks/UseShowError';
import { useNotificationSpawner } from 'lib/hooks/UseNotificationSpawner';
import { useAsyncEffect } from 'lib/hooks/UseAsyncEffect';
import { useState } from 'react';
import {
    checkIfInfrastructureHasSerializationEndpoints,
    serializeAasFromInfrastructure,
} from 'lib/services/serialization-service/serializationActions';
import type { AasViewerAction } from 'components/visualizations/viewer.types';

/**
 * Computes the default action list for the AAS viewer action bar: the download
 * action (only when the selected infrastructure exposes a serialization endpoint)
 * followed by the view-toggle buttons for every switchable view except the
 * current one. Each view calls this hook and passes the result to the
 * presentational {@link AasViewerActionBar}, so a view can append or override
 * its own actions afterwards.
 */
export function useAasViewerActions(): AasViewerAction[] {
    const params = useParams<{ base64AasId: string; view?: string }>();
    const searchParams = useSearchParams();
    const t = useTranslations();
    const env = useEnv();
    const { showError } = useShowError();
    const { spawn } = useNotificationSpawner();
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
                    message: t('pages.aasViewer.messages.downloadSuccess', {
                        endpoint: endpointUrl,
                        infrastructure: infra,
                    }),
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

    const actions: AasViewerAction[] = [];

    if (showDownloadButton) {
        actions.push({ label: 'pages.aasViewer.actions.download', onClick: downloadAAS });
    }

    for (const key of aasViewerConfig.switchable) {
        if (key === currentView) continue;
        const view = aasViewerConfig.views[key];
        if (!view) continue;
        actions.push({
            label: view.label,
            href: `/viewer/${params.base64AasId}/${key}${suffix}`,
        });
    }

    return actions;
}