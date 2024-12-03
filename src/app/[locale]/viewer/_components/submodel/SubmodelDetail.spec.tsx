import { screen } from '@testing-library/react';
import { expect } from '@jest/globals';
import { SubmodelDetail } from 'app/[locale]/viewer/_components/submodel/SubmodelDetail';
import testSubmodel from '../submodel/carbon-footprint/test-submodel/carbonFootprint-test.json';
import { Submodel } from '@aas-core-works/aas-core3.0-typescript/types';
import { CustomRenderReactIntl } from 'test-utils/CustomRenderReactIntl';

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

jest.mock('next-auth', jest.fn());

describe('Submodel Detail', () => {
    it('should render CarbonFootprintVisualizations for irdi id', async () => {
        CustomRenderReactIntl(
            <SubmodelDetail submodel={testSubmodel['carbonFootprint-IrdiId'] as unknown as Submodel} />,
        );
        const map = screen.getByTestId('carbonFootprintVisualizations');
        expect(map).toBeDefined();
        expect(map).toBeInTheDocument();
    });

    it('should render CarbonFootprintVisualizations for URL id', async () => {
        CustomRenderReactIntl(
            <SubmodelDetail submodel={testSubmodel['carbonFootprint-UrlId'] as unknown as Submodel} />,
        );
        const map = screen.getByTestId('carbonFootprintVisualizations');
        expect(map).toBeDefined();
        expect(map).toBeInTheDocument();
    });
});
