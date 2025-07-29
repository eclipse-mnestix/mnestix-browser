import { screen } from '@testing-library/react';
import { expect } from '@jest/globals';
import { CustomRender } from 'test-utils/CustomRender';
import { CO2EBarchart } from 'app/[locale]/viewer/_components/submodel/carbon-footprint/visualization-components/CO2EDistributionDiagrams/CO2EDistributionBarchart';

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
        ResponsiveContainer: ({ children }: never) => (
            <OriginalRechartsModule.ResponsiveContainer
                className="recharts-responsive-container"
                width={800}
                height={800}
            >
                {children}
            </OriginalRechartsModule.ResponsiveContainer>
        ),
    };
});

const co2EquivalentsPerLifecycleStage = {
    A1: 0.235,
    A2: 0.553,
    A3: 0.823,
    A4: 0.123,
};

describe('CarbonFootprint - CO2EquivalentsDistribution', () => {
    it('should renders correct axis descriptions', async () => {
        CustomRender(<CO2EBarchart co2EquivalentsPerLifecycleStage={co2EquivalentsPerLifecycleStage} unit="kg" />);
        expect(screen.getByText('kg CO2e')).toBeInTheDocument();
        expect(screen.getByText('CO2 equivalents')).toBeInTheDocument();
        expect(screen.getByText('A3')).toBeInTheDocument();
        expect(screen.getByText('A2')).toBeInTheDocument();
        expect(screen.getByText('A1')).toBeInTheDocument();
    });
});
