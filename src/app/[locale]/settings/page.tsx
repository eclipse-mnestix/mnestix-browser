'use client';

import { PrivateRoute } from 'components/authentication/PrivateRoute';
import { Box, Card } from '@mui/material';
import { ViewHeading } from 'components/basics/ViewHeading';
import { TabSelectorItem, VerticalTabSelector } from 'components/basics/VerticalTabSelector';
import { useState } from 'react';
import { IdSettingsCard } from './_components/id-settings/IdSettingsCard';
import { useIsMobile } from 'lib/hooks/UseBreakpoints';
import MnestixInfrastructureCard from 'app/[locale]/settings/_components/mnestix-infrastructure/MnestixInfrastructureCard';
import { useEnv } from 'app/EnvProvider';
import { RuleSettings } from 'app/[locale]/settings/_components/role-settings/RuleSettings';
import { useTranslations } from 'next-intl';

enum settingsPageTypes {
    ID_STRUCTURE,
    MNESTIX_INFRASTRUCTURE,
    ROLES,
}

export default function Page() {
    const isMobile = useIsMobile();
    const env = useEnv();
    const t = useTranslations('pages.settings');

    const settingsTabItems: TabSelectorItem[] = [
        {
            id: settingsPageTypes[settingsPageTypes.MNESTIX_INFRASTRUCTURE],
            label: t('infrastructure.title'),
        },
    ];

    if (env.MNESTIX_BACKEND_API_URL) {
        const settingsTabToAdd = {
            id: settingsPageTypes[settingsPageTypes.ID_STRUCTURE],
            label: t('idStructure.title'),
        };
        settingsTabItems.splice(0, 0, settingsTabToAdd);
    }

    if (env.AUTHENTICATION_FEATURE_FLAG && env.BASYX_RBAC_ENABLED) {
        const settingsTabToAdd = {
            id: settingsPageTypes[settingsPageTypes.ROLES],
            label: t('rules.title'),
        };
        settingsTabItems.push(settingsTabToAdd);
    }

    const [selectedTab, setSelectedTab] = useState<TabSelectorItem>(settingsTabItems[0]);

    const renderActiveSettingsTab = () => {
        switch (selectedTab.id) {
            case settingsPageTypes[settingsPageTypes.ID_STRUCTURE]:
                return <IdSettingsCard />;
            case settingsPageTypes[settingsPageTypes.MNESTIX_INFRASTRUCTURE]:
                return <MnestixInfrastructureCard />;
            case settingsPageTypes[settingsPageTypes.ROLES]:
                return <RuleSettings />;
            default:
                return <></>;
        }
    };

    return (
        <PrivateRoute currentRoute={'/settings'}>
            <Box sx={{ p: 4, width: '100%', margin: '0 auto' }} data-testid="settings-route-page">
                <Box sx={{ mb: 3 }} data-testid="settings-header">
                    <ViewHeading title={t('header')} subtitle={t('subHeader')} />
                </Box>
                <Card sx={{ p: 2 }}>
                    <Box display="grid" gridTemplateColumns={isMobile ? '1fr' : '1fr 3fr'}>
                        <VerticalTabSelector
                            items={settingsTabItems}
                            selected={selectedTab}
                            setSelected={setSelectedTab}
                        />
                        {renderActiveSettingsTab()}
                    </Box>
                </Card>
                <Box>
                    <p>{}</p>
                </Box>
            </Box>
        </PrivateRoute>
    );
}
