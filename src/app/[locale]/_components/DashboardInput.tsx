'use client';
import { Typography } from '@mui/material';
import { ManualAasInput } from 'app/[locale]/_components/ManualAasInput';
import { QrScanner } from 'app/[locale]/_components/QrScanner';
import { useRouter } from 'next/navigation';
import { LocalizedError } from 'lib/util/LocalizedError';
import { useTranslations } from 'next-intl';
import { useAasStore } from 'stores/AasStore';
import { performFullAasSearch } from 'lib/services/infrastructure-search-service/infrastructureSearchActions';

export const DashboardInput = () => {
    const { addAasData } = useAasStore();
    const navigate = useRouter();
    const t = useTranslations('pages.dashboard');

    const browseAasUrl = async (searchString: string) => {
        const { isSuccess, result } = await performFullAasSearch(searchString.trim());
        if (!isSuccess) throw new LocalizedError('navigation.errors.urlNotFound');

        if (result.aas) {
            addAasData({
                aas: result.aas,
                aasData: {
                    aasRepositoryOrigin: result.aasData?.aasRepositoryOrigin,
                    submodelDescriptors: result.aasData?.submodelDescriptors ?? [],
                    infrastructureName: result.aasData?.infrastructureName || null,
                },
            });
        }

        navigate.push(result.redirectUrl);
    };

    return (
        <>
            <Typography color="text.secondary" textAlign="center">
                {t('scanIdLabel')}
            </Typography>
            <QrScanner onScan={browseAasUrl} size={250} />
            <Typography color="text.secondary" textAlign="center" sx={{ mb: 2 }}>
                {t('enterManuallyLabel')}:
            </Typography>
            <ManualAasInput onSubmit={browseAasUrl} />
        </>
    );
};
