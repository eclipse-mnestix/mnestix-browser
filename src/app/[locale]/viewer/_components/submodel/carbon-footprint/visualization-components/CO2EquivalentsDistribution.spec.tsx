import { fireEvent, screen } from '@testing-library/react';
import { expect } from '@jest/globals';
import { CustomRender } from 'test-utils/CustomRender';
import { CO2EquivalentsDistribution } from 'app/[locale]/viewer/_components/submodel/carbon-footprint/visualization-components/CO2EquivalentsDistribution';

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

const co2EquivalentsPerLifecycleStage = {
    A1: 0.235,
    A2: 0.553,
    A3: 0.823,
    A4: 0.123,
};

describe('CarbonFootprint - CO2EquivalentsDistribution', () => {
    beforeEach(() => {
        CustomRender(
            <CO2EquivalentsDistribution
                co2EquivalentsPerLifecycleStage={co2EquivalentsPerLifecycleStage}
                totalCO2Equivalents={1.745}
                unit={'kg'}
            />,
        );
    });

    it('should render header with correct style', async () => {
        const headerTypography = screen.getByTestId('co2-equivalents-totalEquivalents-typography');
        expect(headerTypography).toBeDefined();
        expect(headerTypography).toBeInTheDocument();
        expect(headerTypography).toHaveStyle({
            color: 'rgb(25, 118, 210)',
            fontSize: '24',
        });
        expect(headerTypography.children[0]).toHaveStyle({
            fontWeight: 600,
        });
    });

    it('should render total CO2 equivalents correctly', async () => {
        const headerTypography = screen.getByTestId('co2-equivalents-totalEquivalents-typography');
        expect(headerTypography).toHaveTextContent('1.745 kg in total');
    });

    it('should render barchart as default', async () => {
        expect(screen.getByTestId('co2-equivalents-distribution-box')).toBeInTheDocument();
        expect(screen.queryByTestId('co2e-barchart')).toBeInTheDocument();
    });

    it('should switch between chart views', async () => {
        expect(screen.getByTestId('co2-equivalents-distribution-box')).toBeInTheDocument();
        expect(screen.queryByTestId('co2e-list')).toBeNull();

        const listToggleButton = screen.getByTestId('list-toggle-button');
        fireEvent.click(listToggleButton);

        expect(screen.getByTestId('co2e-list')).toBeInTheDocument();
    });
});
