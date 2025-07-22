import { screen, waitFor, act } from '@testing-library/react';
import { expect } from '@jest/globals';
import testSubmodel from '../../submodel/carbon-footprint/test-submodel/carbonFootprint-test.json';
import { Submodel } from 'lib/api/aas/models';
import { CustomRender } from 'test-utils/CustomRender';
import {
    CarbonFootprintVisualizations
} from 'app/[locale]/viewer/_components/submodel/carbon-footprint/CarbonFootprintVisualizations';

window.ResizeObserver =
    window.ResizeObserver ||
    jest.fn().mockImplementation(() => ({
        disconnect: jest.fn(),
        observe: jest.fn(),
        unobserve: jest.fn(),
    }));

const mockFetch = jest.fn();
global.fetch = mockFetch;

const mockGeocodeResponse = {
    ok: true,
    json: async () => [
        {
            lat: '50',
            lon: '10',
        },
    ],
};

jest.mock('recharts', () => {
    const OriginalRechartsModule = jest.requireActual('recharts');

    return {
        ...OriginalRechartsModule,
        ResponsiveContainer: ({ height, children }: never) => (
            <div className="recharts-responsive-container" style={{ width: 800, height }}>
                {children}
            </div>
        ),
    };
});

describe('CarbonFootprintVisualizations Detail', () => {
    beforeEach(() => {
        mockFetch.mockClear();
        mockFetch.mockResolvedValue(mockGeocodeResponse);
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    it('should render all submodel visualilzations for irdi id', async () => {
        await act(async () => {
            CustomRender(
                <CarbonFootprintVisualizations submodel={testSubmodel['carbonFootprint-IrdiId'] as unknown as Submodel} />,
            );
        });
        await assertOnElements();
    });

    it('should render all submodel visualilzations for URL id', async () => {
        await act(async () => {
            CustomRender(
                <CarbonFootprintVisualizations submodel={testSubmodel['carbonFootprint-UrlId'] as unknown as Submodel} />,
            );
        });
        await assertOnElements();
    });
});

async function assertOnElements() {
    await waitFor(() => {
        const totalCo2Equivalents = screen.getByTestId('co2-equivalents');
        const productLifecycle = screen.getByTestId('product-lifecycle-stepper');
        const co2EquivalentsDistribution = screen.getByTestId('co2-equivalents-distribution-box');
        const co2Comparison = screen.getByTestId('co2-comparison-box');
        const productJourney = screen.getByTestId('product-journey-box');
        const calculationMethod = screen.getByTestId('co2-calculation-method-text');

        expect(totalCo2Equivalents).toBeDefined();
        expect(totalCo2Equivalents).toBeInTheDocument();

        expect(productLifecycle).toBeDefined();
        expect(productLifecycle).toBeInTheDocument();

        expect(co2EquivalentsDistribution).toBeDefined();
        expect(co2EquivalentsDistribution).toBeInTheDocument();

        expect(co2Comparison).toBeDefined();
        expect(co2Comparison).toBeInTheDocument();

        expect(productJourney).toBeDefined();
        expect(productJourney).toBeInTheDocument();

        expect(calculationMethod).toBeDefined();
        expect(calculationMethod).toBeInTheDocument();
    }, { timeout: 3000 });
}