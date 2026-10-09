import { describe, expect, it, beforeEach } from '@jest/globals';
import { waitFor } from '@testing-library/react';
import { CustomRender } from 'test-utils/CustomRender';
import type { AasViewerAction } from 'components/visualizations/viewer.types';

const mockState: {
    params: Record<string, string>;
    searchParams: Record<string, string>;
    config: unknown;
    context: { aas: unknown; submodels: unknown[]; infrastructureName?: string };
} = {
    params: { base64AasId: 'abc' },
    searchParams: {},
    config: undefined,
    context: { aas: null, submodels: [], infrastructureName: undefined },
};

jest.mock('next/navigation', () => ({
    useParams: () => mockState.params,
    useSearchParams: () => new URLSearchParams(mockState.searchParams),
}));

jest.mock('../_visualizations/viewer.config', () => ({
    getAasViewerConfig: () => mockState.config,
}));

jest.mock('../../../EnvProvider', () => ({ useEnv: () => ({}) }));

jest.mock('../../../../components/contexts/CurrentAasContext', () => ({
    useCurrentAasContext: () => mockState.context,
}));

jest.mock('../../../../lib/services/serialization-service/serializationActions', () => ({
    checkIfInfrastructureHasSerializationEndpoints: jest
        .fn()
        .mockResolvedValue({ isSuccess: true }),
    serializeAasFromInfrastructure: jest.fn(),
}));

import { useAasViewerActions } from './useAasViewerActions';

const makeConfig = (switchable: string[]) => ({
    default: 'default',
    switchable,
    views: Object.fromEntries(
        switchable.map((key) => [key, { label: `pages.aasViewer.views.${key}`, component: () => null }]),
    ),
});

// Captured by a harness component on every render; `useAasViewerActions` result is
// read back after `CustomRender` mounts it.
let capturedActions: AasViewerAction[] = [];

function renderActions() {
    capturedActions = [];
    function Harness() {
        capturedActions = useAasViewerActions();
        return null;
    }
    CustomRender(<Harness />);
    return capturedActions;
}

describe('useAasViewerActions', () => {
    beforeEach(() => {
        mockState.params = { base64AasId: 'abc' };
        mockState.searchParams = {};
        mockState.context = { aas: null, submodels: [], infrastructureName: undefined };
    });

    it('includes the download action first when serialization is available', async () => {
        mockState.context = { aas: null, submodels: [], infrastructureName: 'infra' };
        mockState.config = makeConfig(['default', 'product']);

        renderActions();
        // The serialization check resolves asynchronously; wait for the download action.
        await waitFor(() => expect(capturedActions[0]?.onClick).toBeDefined());

        expect(capturedActions[0]?.label).toBe('pages.aasViewer.actions.download');
        expect(capturedActions[1]?.href).toBe('/viewer/abc/product');
    });

    it('omits the download action when no infrastructure is set', () => {
        mockState.config = makeConfig(['default', 'product']);

        const actions = renderActions();

        expect(actions.every((a) => a.onClick === undefined)).toBe(true);
        expect(actions[0]?.href).toBe('/viewer/abc/product');
    });

    it('excludes the current view from the toggle buttons', () => {
        mockState.params = { base64AasId: 'abc', view: 'product' };
        mockState.config = makeConfig(['default', 'product']);

        const actions = renderActions();

        expect(actions.map((a) => a.href)).toEqual(['/viewer/abc/default']);
    });

    it('preserves query params in the view hrefs', () => {
        mockState.searchParams = { repoUrl: 'https://repo' };
        mockState.config = makeConfig(['default', 'product']);

        const actions = renderActions();

        expect(actions[0]?.href).toBe('/viewer/abc/product?repoUrl=https%3A%2F%2Frepo');
    });

    it('returns no view buttons when only the current view is switchable', () => {
        mockState.params = { base64AasId: 'abc', view: 'default' };
        mockState.config = makeConfig(['default']);

        const actions = renderActions();

        expect(actions).toEqual([]);
    });
});