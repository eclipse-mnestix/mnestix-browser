import { screen } from '@testing-library/react';
import { expect } from '@jest/globals';
import { SubmodelDetail } from 'app/[locale]/viewer/_components/submodel/SubmodelDetail';
import testSubmodel from '../submodel/carbon-footprint/test-submodel/carbonFootprint-test.json';
import { Submodel } from 'lib/api/aas/models';
import { CustomRender } from 'test-utils/CustomRender';

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
        CustomRender(
            <SubmodelDetail
                submodel={testSubmodel['carbonFootprint-IrdiId'] as unknown as Submodel}
                repositoryUrl={'https://test.de'}
            />,
        );
        const map = screen.getByTestId('carbonFootprintVisualizations');
        expect(map).toBeDefined();
        expect(map).toBeInTheDocument();
    });

    it('should render CarbonFootprintVisualizations for URL id', async () => {
        CustomRender(
            <SubmodelDetail
                submodel={testSubmodel['carbonFootprint-UrlId'] as unknown as Submodel}
                repositoryUrl={'https://test.de'}
            />,
        );
        const map = screen.getByTestId('carbonFootprintVisualizations');
        expect(map).toBeDefined();
        expect(map).toBeInTheDocument();
    });

    it('should use third semanticId when first two are invalid', async () => {
        // Create test submodel with multiple semanticIds (first two invalid)
        const testSubmodelWithMultipleIds = {
            ...testSubmodel['carbonFootprint-UrlId'],
            semanticId: {
                keys: [
                    { value: 'invalid-semantic-id-1' },
                    { value: 'invalid-semantic-id-2' },
                    { value: 'https://admin-shell.io/idta/CarbonFootprint/CarbonFootprint/0/9' }, // Valid CarbonFootprint ID
                ],
            },
        } as unknown as Submodel;

        CustomRender(<SubmodelDetail submodel={testSubmodelWithMultipleIds} repositoryUrl={'https://test.de'} />);

        // Verify visualization component renders using 3rd semanticId
        const map = screen.getByTestId('carbonFootprintVisualizations');
        expect(map).toBeDefined();
        expect(map).toBeInTheDocument();

        // Verify no error state for invalid IDs
        expect(screen.queryByTestId('invalid-semantic-id-1')).toBeNull();
        expect(screen.queryByTestId('invalid-semantic-id-2')).toBeNull();
    });
});
