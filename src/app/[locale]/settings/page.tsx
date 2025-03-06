'use client';

import { PrivateRoute } from 'components/authentication/PrivateRoute';
import { Box, Card } from '@mui/material';
import { FormattedMessage, useIntl } from 'react-intl';
import { ViewHeading } from 'components/basics/ViewHeading';
import { TabSelectorItem, VerticalTabSelector } from 'components/basics/VerticalTabSelector';
import { messages } from 'lib/i18n/localization';
import { useState } from 'react';
import { IdSettingsCard } from './_components/id-settings/IdSettingsCard';
import { useIsMobile } from 'lib/hooks/UseBreakpoints';
import { MnestixConnectionsCard } from 'app/[locale]/settings/_components/mnestix-connections/MnestixConnectionsCard';
import { useEnv } from 'app/env/provider';
import { RoleSettings } from 'app/[locale]/settings/_components/role-settings/RoleSettings';
import { useTranslations } from 'next-intl';

enum settingsPageTypes {
    ID_STRUCTURE,
    MNESTIX_CONNECTIONS,
    ROLES,
}

export default function Page() {
    const intl = useIntl();
    const isMobile = useIsMobile();
    const env = useEnv();
    const t = useTranslations('settings');

    const settingsTabItems: TabSelectorItem[] = [
        {
            id: settingsPageTypes[settingsPageTypes.MNESTIX_CONNECTIONS],
            label: intl.formatMessage(messages.mnestix.connections.title),
        },
    ];

    if (env.MNESTIX_BACKEND_API_URL) {
        const settingsTabToAdd = {
            id: settingsPageTypes[settingsPageTypes.ID_STRUCTURE],
            label: intl.formatMessage(messages.mnestix.idStructure),
        };
        settingsTabItems.splice(0, 0, settingsTabToAdd);
    }

    if (env.AUTHENTICATION_FEATURE_FLAG) {
        const settingsTabToAdd = {
            id: settingsPageTypes[settingsPageTypes.ROLES],
            label: t('roles.title'),
        };
        settingsTabItems.push(settingsTabToAdd);
    }

    const [selectedTab, setSelectedTab] = useState<TabSelectorItem>(settingsTabItems[0]);

    const renderActiveSettingsTab = () => {
        switch (selectedTab.id) {
            case settingsPageTypes[settingsPageTypes.ID_STRUCTURE]:
                return <IdSettingsCard />;
            case settingsPageTypes[settingsPageTypes.MNESTIX_CONNECTIONS]:
                return <MnestixConnectionsCard />;
            case settingsPageTypes[settingsPageTypes.ROLES]:
                return <RoleSettings />;
            default:
                return <></>;
        }
    };

    return (
        <PrivateRoute currentRoute={'/settings'}>
            <Box sx={{ p: 4, width: '100%', margin: '0 auto' }} data-testid="settings-route-page">
                <Box sx={{ mb: 3 }} data-testid="settings-header">
                    <ViewHeading title={<FormattedMessage {...messages.mnestix.settings} />} />
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
