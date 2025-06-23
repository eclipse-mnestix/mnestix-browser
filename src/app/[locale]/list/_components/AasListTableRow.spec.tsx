import { expect } from '@jest/globals';
import { CustomRender } from 'test-utils/CustomRender';
import { CurrentAasContextProvider } from 'components/contexts/CurrentAasContext';
import { screen, waitFor } from '@testing-library/react';
import { AasListTableRow } from 'app/[locale]/list/_components/AasListTableRow';
import { ListEntityDto } from 'lib/services/list-service/ListService';
import * as nameplateDataActions from 'lib/services/list-service/aasListApiActions';
import { JSX } from 'react';

jest.mock('next/navigation', () => ({
    useRouter() {
        return {
            prefetch: () => null,
        };
    },
    useParams() {
        return {};
    },
}));
jest.mock('./../../../../lib/services/list-service/aasListApiActions');
jest.mock('next-auth', jest.fn());
jest.mock('./../../../../lib/services/repository-access/repositorySearchActions', () => ({
    getThumbnailFromShell: jest.fn(() => Promise.resolve({ success: true, result: { fileType: '', fileContent: '' } })),
}));
describe('AasListTableRow', () => {
    const listEntry: ListEntityDto = {
        aasId: 'aasId',
        thumbnail: '',
        assetId: 'assetId',
    };

    const listRowWrapper = (children: JSX.Element) => {
        CustomRender(
            <CurrentAasContextProvider>
                <table>
                    <tbody>
                        <tr>{children}</tr>
                    </tbody>
                </table>
            </CurrentAasContextProvider>,
        );
    };

    it('shows the table row with content in english', async () => {
        listRowWrapper(
            <AasListTableRow
                repositoryUrl={'https://test-repository.de'}
                aasListEntry={listEntry}
                enrichedData={{
                    manufacturerName: 'ManufacturerEN',
                    productDesignation: 'ProductDesignationEN',
                }}
                checkBoxDisabled={() => undefined}
                comparisonFeatureFlag={true}
                selectedAasList={undefined}
                updateSelectedAasList={() => undefined}
            />,
        );

        await waitFor(() => screen.getByTestId('list-checkbox'));
        expect(screen.getByTestId('list-thumbnail')).toBeInTheDocument();
        expect(screen.getByTestId('list-manufacturer-name')).toHaveTextContent('ManufacturerEN');
        expect(screen.getByTestId('list-product-designation')).toHaveTextContent('ProductDesignationEN');
        expect(screen.getByTestId('list-assetId')).toHaveTextContent('assetId');
        expect(screen.getByTestId('list-aasId')).toHaveTextContent('aasId');
        expect(screen.getByTestId('list-to-detailview-button')).toBeInTheDocument();
    });

    it('shows the table row without nameplate content', async () => {
        (nameplateDataActions.getNameplateValuesForAAS as jest.Mock).mockImplementation(
            jest.fn(() => {
                return {
                    success: true,
                    manufacturerName: [],
                    manufacturerProductDesignation: [],
                };
            }),
        );
        listRowWrapper(
            <AasListTableRow
                repositoryUrl={'https://test-repository.de/repo'}
                aasListEntry={listEntry}
                checkBoxDisabled={() => undefined}
                comparisonFeatureFlag={true}
                selectedAasList={undefined}
                updateSelectedAasList={() => undefined}
            />,
        );
        await waitFor(() => screen.getByTestId('list-checkbox'));
        expect(screen.getByTestId('list-thumbnail')).toBeInTheDocument();
        expect(screen.getByTestId('list-manufacturer-name')).toHaveTextContent('');
        expect(screen.getByTestId('list-product-designation')).toHaveTextContent('');
        expect(screen.getByTestId('list-assetId')).toHaveTextContent('assetId');
        expect(screen.getByTestId('list-aasId')).toHaveTextContent('aasId');
        expect(screen.getByTestId('list-to-detailview-button')).toBeInTheDocument();
    });
});
