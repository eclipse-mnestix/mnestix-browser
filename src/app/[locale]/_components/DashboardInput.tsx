'use client';
import { Typography } from '@mui/material';
import { ManualAasInput } from 'app/[locale]/_components/ManualAasInput';
import { QrScanner } from 'app/[locale]/_components/QrScanner';
import { useRouter } from 'next/navigation';
import { useAasOriginSourceState, useAasState, useRegistryAasState } from 'components/contexts/CurrentAasContext';
import { LocalizedError } from 'lib/util/LocalizedError';
import { performFullAasSearch } from 'lib/services/search-actions/searchActions';
import { useTranslations } from 'next-intl';

export const DashboardInput = () => {
    const [, setAas] = useAasState();
    const [, setRegistryAasData] = useRegistryAasState();
    const [, setAasOriginUrl] = useAasOriginSourceState();
    const navigate = useRouter();
    const t = useTranslations('dashboard');

    const browseAasUrl = async (searchString: string) => {
        const { isSuccess, result } = await performFullAasSearch(searchString.trim());
        if (!isSuccess) throw new LocalizedError('errors.url-not-found');

        if (result.aas) {
            setAas(result.aas);
            setRegistryAasData(result.aasData);
            setAasOriginUrl(result.aasData?.aasRepositoryOrigin ?? null);
        }
        navigate.push(result.redirectUrl);
    };

    return (
        <>
            <Typography color="text.secondary" textAlign="center">
                {t('scan-id-label')}
            </Typography>
            <QrScanner onScan={browseAasUrl} size={250} />
            <Typography color="text.secondary" textAlign="center" sx={{ mb: 2 }}>
                {t('enter-manually-label')}:
            </Typography>
            <ManualAasInput onSubmit={browseAasUrl} />
        </>
    );
};
