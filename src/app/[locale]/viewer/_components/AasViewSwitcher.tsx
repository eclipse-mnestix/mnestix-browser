'use client';

import { Box, Tab, Tabs } from '@mui/material';
import Link from 'next/link';
import { useParams, useSearchParams } from 'next/navigation';
import { useTranslations } from 'next-intl';
import { getAasViewerConfig } from 'app/[locale]/viewer/_visualizations/viewer.config';
import { useEnv } from 'app/EnvProvider';

/**
 * User-facing switcher between the AAS visualizations declared as `switchable`
 * in {@link getAasViewerConfig}. Rendered once by the viewer layout so it persists
 * across view navigations. Each tab is a real navigation link, so views are
 * deep-linkable and keyboard/screen-reader friendly.
 */
export function AasViewSwitcher() {
    const params = useParams<{ base64AasId: string; view?: string }>();
    const searchParams = useSearchParams();
    const t = useTranslations();
    const aasViewerConfig = getAasViewerConfig(useEnv());

    const currentView = params.view ?? aasViewerConfig.default;

    // Hide the switcher when there's nothing to switch, or when the current view
    // isn't part of the switchable set (e.g. a direct-URL-only view). Rendering
    // Tabs with a value that matches no Tab makes MUI warn and breaks the
    // indicator, and there'd be no correct tab to highlight anyway.
    if (aasViewerConfig.switchable.length <= 1 || !aasViewerConfig.switchable.includes(currentView)) {
        return null;
    }
    const query = searchParams.toString();
    const suffix = query ? `?${query}` : '';

    // Labels may be i18n keys (OSS config) or raw display strings (custom
    // overrides), so bypass next-intl's compile-time key typing here.
    const looseT = t as unknown as ((key: string) => string) & { has: (key: string) => boolean };

    function resolveLabel(label: string) {
        return looseT.has(label) ? looseT(label) : label;
    }

    return (
        <Box sx={{ borderBottom: 1, borderColor: 'divider', display: 'flex', justifyContent: 'center' }}>
            <Tabs value={currentView} data-testid="aas-view-switcher">
                {aasViewerConfig.switchable.map((key) => {
                    const view = aasViewerConfig.views[key];
                    if (!view) return null;
                    return (
                        <Tab
                            key={key}
                            value={key}
                            label={resolveLabel(view.label)}
                            component={Link}
                            href={`/viewer/${params.base64AasId}/${key}${suffix}`}
                            data-testid={`aas-view-tab-${key}`}
                        />
                    );
                })}
            </Tabs>
        </Box>
    );
}
