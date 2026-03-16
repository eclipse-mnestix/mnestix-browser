import { fireEvent, screen, waitFor } from '@testing-library/react';
import AasList from 'app/[locale]/list/_components/AasList';
import { CustomRender } from 'test-utils/CustomRender';
import * as listActions from 'lib/services/list-service/aasListApiActions';

jest.mock('lib/services/list-service/aasListApiActions');
jest.mock('app/[locale]/list/_components/AasListTableRow', () => {
    const { TableCell } = jest.requireActual('@mui/material');

    return {
        AasListTableRow: ({ aasListEntry, enrichedData }: any) => (
            <>
                <TableCell data-testid="mock-row-aas-id">{aasListEntry.aasId}</TableCell>
                <TableCell data-testid="mock-row-manufacturer">{enrichedData?.manufacturerName ?? ''}</TableCell>
                <TableCell />
                <TableCell />
                <TableCell />
                <TableCell />
            </>
        ),
    };
});

function getRenderedRowOrder() {
    return screen.getAllByTestId(/list-row-/).map((row) => row.getAttribute('data-testid')?.replace('list-row-', ''));
}

describe('AasList', () => {
    beforeEach(() => {
        jest.clearAllMocks();
        (listActions.getNameplateValuesForAAS as jest.Mock).mockImplementation(
            async (_repositoryUrl: string, aasId: string) => {
                const nameplateByAasId: Record<string, { manufacturerName: { en: string }[] }> = {
                    'aas-1': { manufacturerName: [{ en: 'Zulu' }] },
                    'aas-2': { manufacturerName: [{ en: 'Alpha' }] },
                    'aas-3': { manufacturerName: [{ en: 'Mike' }] },
                };

                return {
                    manufacturerName: nameplateByAasId[aasId].manufacturerName,
                    manufacturerProductDesignation: [],
                };
            },
        );
    });

    it('sorts the rendered rows ascending and descending when clicking the manufacturer header', async () => {
        const columnSortUpdateCallback = jest.fn();

        CustomRender(
            <AasList
                repositoryUrl="https://test-repository.de"
                shells={{
                    success: true,
                    entities: [
                        { aasId: 'aas-1', assetId: 'asset-1', thumbnail: '' },
                        { aasId: 'aas-2', assetId: 'asset-2', thumbnail: '' },
                        { aasId: 'aas-3', assetId: 'asset-3', thumbnail: '' },
                    ],
                    cursor: '',
                }}
                comparisonFeatureFlag={false}
                selectedAasList={[]}
                updateSelectedAasList={jest.fn()}
                columnSortUpdateCallback={columnSortUpdateCallback}
            />,
        );

        await waitFor(() => {
            expect(getRenderedRowOrder()).toEqual(['aas-1', 'aas-2', 'aas-3']);
        });

        fireEvent.click(screen.getByRole('button', { name: 'Manufacturer name' }));

        await waitFor(() => {
            expect(getRenderedRowOrder()).toEqual(['aas-2', 'aas-3', 'aas-1']);
        });
        expect(columnSortUpdateCallback).toHaveBeenLastCalledWith('manufacturer', 'asc');

        fireEvent.click(screen.getByRole('button', { name: 'Manufacturer name' }));

        await waitFor(() => {
            expect(getRenderedRowOrder()).toEqual(['aas-1', 'aas-3', 'aas-2']);
        });
        expect(columnSortUpdateCallback).toHaveBeenLastCalledWith('manufacturer', 'desc');
    });
});
