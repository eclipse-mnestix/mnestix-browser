'use client';
import { Button, Typography } from '@mui/material';
import { ManualAasInput } from 'app/[locale]/_components/ManualAasInput';
import { QrScanner } from 'app/[locale]/_components/QrScanner';
import { useRouter } from 'next/navigation';
import { LocalizedError } from 'lib/util/LocalizedError';
import { useTranslations } from 'next-intl';
import { useAasStore } from 'stores/AasStore';
import { useShowError } from 'lib/hooks/UseShowError';
import {
    performFullAasSearch,
    searchAasInInfrastructure,
} from 'lib/services/infrastructure-search-service/infrastructureSearchActions';

export const DashboardInput = () => {
    const { addAasData } = useAasStore();
    const navigate = useRouter();
    const t = useTranslations('pages.dashboard');
    const { showError } = useShowError();

    const searchInput = async (
        searchString: string,
        error_message: string,
        onErrorCallback: (error: LocalizedError) => void,
        onSuccessCallback: () => void,
        infrastructureName?: string,
    ) => {
        try {
            const { isSuccess, result } = infrastructureName
                ? await searchAasInInfrastructure(searchString, infrastructureName)
                : await performFullAasSearch(searchString.trim());
            if (!(isSuccess && result && result.aas)) {
                const error = new LocalizedError('navigation.errors.urlNotFound');
                showError(error);
                onErrorCallback(error);
            } else {
                onSuccessCallback();
                addAasData({
                    aas: result.aas,
                    aasData: {
                        aasRepositoryOrigin: result.aasData?.aasRepositoryOrigin,
                        submodelDescriptors: result.aasData?.submodelDescriptors ?? [],
                        infrastructureName: result.aasData?.infrastructureName || null,
                    },
                });

                navigate.push(result.redirectUrl);
            }
        } catch (e) {
            showError(new Error(error_message));
            onErrorCallback(e instanceof LocalizedError ? e : new LocalizedError('navigation.errors.unexpectedError'));
            return;
        }
    };

    return (
        <>
            <Typography color="text.secondary" textAlign="center">
                {t('scanIdLabel')}
            </Typography>
            <QrScanner searchInput={searchInput} size={250} />
            <Typography color="text.secondary" textAlign="center" sx={{ mb: 2 }}>
                {t('enterManuallyLabel')}:
            </Typography>
            <ManualAasInput searchInput={searchInput} />
        </>
    );
};
