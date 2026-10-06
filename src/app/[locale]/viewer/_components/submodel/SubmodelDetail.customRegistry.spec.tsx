import { screen } from '@testing-library/react';
import { describe, expect, it } from '@jest/globals';
import { Submodel } from 'lib/api/aas/models';
import { SubmodelDetail } from 'app/[locale]/viewer/_components/submodel/SubmodelDetail';
import { CustomRender } from 'test-utils/CustomRender';

const CUSTOM_SEMANTIC_ID = 'https://example.com/CustomerSubmodel/1/0';

// Simulates a customization that overrides submodel.config.ts: the visualization is
// reachable ONLY through the factory, never through the OSS map literal. If SubmodelDetail
// ever imports the map directly again, this test fails.
jest.mock('./submodel.config', () => ({
    getSubmodelVisualizationMap: () => ({
        'https://example.com/CustomerSubmodel/1/0': () => <div data-testid="customer-visualization" />,
    }),
}));

jest.mock('next-auth', jest.fn());

describe('SubmodelDetail with an overridden visualization registry', () => {
    const submodel = {
        id: 'submodel-id',
        idShort: 'CustomerSubmodel',
        semanticId: { keys: [{ value: CUSTOM_SEMANTIC_ID }] },
        submodelElements: [],
    } as unknown as Submodel;

    it('renders the visualization registered through the factory', async () => {
        CustomRender(<SubmodelDetail submodel={submodel} submodelRepositoryUrl="https://test.de" />);

        expect(screen.getByTestId('customer-visualization')).toBeInTheDocument();
    });

    it('falls back to the generic visualization for unregistered semanticIds', async () => {
        const unregistered = {
            ...submodel,
            semanticId: { keys: [{ value: 'https://example.com/Unregistered' }] },
        } as unknown as Submodel;

        CustomRender(<SubmodelDetail submodel={unregistered} submodelRepositoryUrl="https://test.de" />);

        expect(screen.queryByTestId('customer-visualization')).toBeNull();
    });
});
