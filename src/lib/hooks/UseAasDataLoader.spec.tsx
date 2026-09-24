import { expect } from '@jest/globals';
import { waitFor } from '@testing-library/react';
import { useState } from 'react';
import { CustomRender } from 'test-utils/CustomRender';
import { useAasLoader } from 'lib/hooks/UseAasDataLoader';
import { CurrentAasContextType } from 'components/contexts/CurrentAasContext';

const mockI18nRouterPush = jest.fn();

jest.mock('../../i18n/routing', () => ({
    useRouter: () => ({
        push: mockI18nRouterPush,
        replace: jest.fn(),
    }),
}));
jest.mock('next/navigation', () => ({
    useRouter: () => ({
        push: jest.fn(),
        replace: jest.fn(),
    }),
}));
jest.mock('../../app/EnvProvider', () => ({
    useEnv: () => ({
        SUBMODEL_WHITELIST: '[]',
        WHITELIST_FEATURE_FLAG: false,
    }),
}));
jest.mock('../../stores/AasStore', () => ({
    useAasStore: () => ({
        getAasData: () => undefined,
    }),
}));
jest.mock('./UseShowError', () => ({
    useShowError: () => ({
        showError: jest.fn(),
    }),
}));
jest.mock('../services/infrastructure-search-service/infrastructureSearchActions');
jest.mock('../services/aas-repository-service/aasRepositoryActions');

import { performFullAasSearch } from '../services/infrastructure-search-service/infrastructureSearchActions';

function AasLoaderProbe() {
    const context: CurrentAasContextType = {
        aasState: useState(undefined),
        submodelState: useState([]),
        registryAasData: useState(undefined),
        aasOriginUrl: useState(undefined),
        isLoadingAas: useState(false),
        isLoadingSubmodels: useState(false),
        infrastructureName: useState(undefined),
    };
    useAasLoader(context, 'testAasId', undefined);
    return null;
}

describe('useAasLoader', () => {
    it('redirects to the search redirect url through the locale-aware router', async () => {
        (performFullAasSearch as jest.Mock).mockResolvedValue({
            isSuccess: true,
            result: {
                aas: undefined,
                redirectUrl: '/viewer/registry?aasId=test123',
            },
        });

        CustomRender(<AasLoaderProbe />);

        await waitFor(() => {
            expect(mockI18nRouterPush).toHaveBeenCalledWith('/viewer/registry?aasId=test123');
        });
    });
});
