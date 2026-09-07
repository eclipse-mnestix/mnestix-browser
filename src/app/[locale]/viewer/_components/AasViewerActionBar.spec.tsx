import { describe, expect, it, beforeEach } from '@jest/globals';
import { screen } from '@testing-library/react';
import { CustomRender } from 'test-utils/CustomRender';

// Mutable holders so each test can set the route params / registry the action
// bar reads. Referenced lazily inside the factories, so safe against jest's
// hoisting of these mock calls.
const mockState: {
    params: Record<string, string>;
    config: unknown;
    context: { aas: unknown; submodels: unknown[]; infrastructureName?: string };
} = {
    params: { base64AasId: 'abc' },
    config: undefined,
    context: { aas: null, submodels: [], infrastructureName: undefined },
};

jest.mock('next/navigation', () => ({
    useParams: () => mockState.params,
    useSearchParams: () => new URLSearchParams(),
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

// Imported after the mocks so the bar binds to the mocked modules.
import { AasViewerActionBar } from './AasViewerActionBar';

const makeConfig = (switchable: string[]) => ({
    default: 'default',
    switchable,
    views: Object.fromEntries(switchable.map((key) => [key, { label: key, component: () => null }])),
});

describe('AasViewerActionBar', () => {
    beforeEach(() => {
        mockState.params = { base64AasId: 'abc' };
        mockState.context = { aas: null, submodels: [], infrastructureName: 'infra' };
    });

    it('renders nothing when there are no other views and no download is available', () => {
        mockState.context = { aas: null, submodels: [], infrastructureName: undefined };
        mockState.config = makeConfig(['default']);

        CustomRender(<AasViewerActionBar />);

        expect(screen.queryByTestId('aas-download-button')).not.toBeInTheDocument();
        expect(screen.queryByTestId('aas-view-menu-button')).not.toBeInTheDocument();
    });

    it('renders the download button and the other view when serialization is available', async () => {
        mockState.config = makeConfig(['default', 'product']);

        CustomRender(<AasViewerActionBar />);

        expect(await screen.findByTestId('aas-download-button')).toBeInTheDocument();
        expect(screen.getByTestId('aas-view-button-product')).toBeInTheDocument();
        expect(screen.queryByTestId('aas-view-menu-button')).not.toBeInTheDocument();
    });

    it('promotes the first other view when download is unavailable', () => {
        mockState.context = { aas: null, submodels: [], infrastructureName: undefined };
        mockState.config = makeConfig(['default', 'product']);

        CustomRender(<AasViewerActionBar />);

        expect(screen.queryByTestId('aas-download-button')).not.toBeInTheDocument();
        expect(screen.getByTestId('aas-view-button-product')).toBeInTheDocument();
    });

    it('folds views beyond the second into the overflow menu', () => {
        mockState.config = makeConfig(['default', 'product', 'third', 'fourth']);

        CustomRender(<AasViewerActionBar />);

        expect(screen.getByTestId('aas-view-button-product')).toBeInTheDocument();
        expect(screen.getByTestId('aas-view-menu-button')).toBeInTheDocument();
    });

    it('excludes the current view from the buttons', () => {
        mockState.params = { base64AasId: 'abc', view: 'product' };
        mockState.config = makeConfig(['default', 'product']);

        CustomRender(<AasViewerActionBar />);

        expect(screen.queryByTestId('aas-view-button-product')).not.toBeInTheDocument();
        expect(screen.getByTestId('aas-view-button-default')).toBeInTheDocument();
    });

    it('resolves an i18n-key label against the message tree instead of showing the key', () => {
        mockState.config = {
            default: 'default',
            switchable: ['default', 'product'],
            views: {
                default: { label: 'pages.aasViewer.views.default', component: () => null },
                product: { label: 'pages.aasViewer.views.product', component: () => null },
            },
        };

        CustomRender(<AasViewerActionBar />);

        expect(screen.getByTestId('aas-view-button-product')).toHaveTextContent('Product view');
    });

    it('shows the raw label when it is not an i18n key', () => {
        mockState.config = makeConfig(['default', 'timeseries']);

        CustomRender(<AasViewerActionBar />);

        expect(screen.getByTestId('aas-view-button-timeseries')).toHaveTextContent('timeseries');
    });
});