import { screen } from '@testing-library/react';
import { expect } from '@jest/globals';
import testSubmodel from '../../submodel/carbon-footprint/test-submodel/carbonFootprint-test.json';
import { Submodel } from '@aas-core-works/aas-core3.0-typescript/types';
import { CustomRenderNextIntl } from 'test-utils/CustomRenderNextIntl';
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
    it('should render all submodel visualilzations for irdi id', async () => {
        CustomRenderNextIntl(
            <CarbonFootprintVisualizations submodel={testSubmodel['carbonFootprint-IrdiId'] as unknown as Submodel} />,
        );
        assertOnElements();
    });

    it('should render all submodel visualilzations for URL id', async () => {
        CustomRenderNextIntl(
            <CarbonFootprintVisualizations submodel={testSubmodel['carbonFootprint-UrlId'] as unknown as Submodel} />,
        );
        assertOnElements();
    });
});

function assertOnElements() {
    const totalCo2Equivalents = screen.getByTestId('co2-equivalents');
    expect(totalCo2Equivalents).toBeDefined();
    expect(totalCo2Equivalents).toBeInTheDocument();

    const productLifecycle = screen.getByTestId('product-lifecycle-stepper');
    expect(productLifecycle).toBeDefined();
    expect(productLifecycle).toBeInTheDocument();

    const co2EquivalentsDistribution = screen.getByTestId('co2-equivalents-distribution-box');
    expect(co2EquivalentsDistribution).toBeDefined();
    expect(co2EquivalentsDistribution).toBeInTheDocument();

    const co2Comparison = screen.getByTestId('co2-comparison-box');
    expect(co2Comparison).toBeDefined();
    expect(co2Comparison).toBeInTheDocument();

    const productJourney = screen.getByTestId('product-journey-box');
    expect(productJourney).toBeDefined();
    expect(productJourney).toBeInTheDocument();

    const calculationMethod = screen.getByTestId('co2-calculation-method-text');
    expect(calculationMethod).toBeDefined();
    expect(calculationMethod).toBeInTheDocument();
}

