import { expect } from '@jest/globals';
import { CustomRender } from 'test-utils/CustomRender';
import { CurrentAasContextProvider } from 'components/contexts/CurrentAasContext';
import { screen, waitFor } from '@testing-library/react';
import { AasListTableRow } from 'app/[locale]/list/_components/AasListTableRow';
import { ListEntityDto } from 'lib/services/list-service/ListService';

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
jest.mock('./../../../../lib/services/list-service/aasListApiActions', () => ({
    getNameplateValuesForAAS: jest.fn(() =>
        Promise.resolve({
            success: true,
            manufacturerName: [{ de: 'ManufacturerDE' }, { en: 'ManufacturerEN' }],
            manufacturerProductDesignation: [{ de: 'ProductDesignationDE' }, { en: 'ProductDesignationEN' }],
        }),
    ),
}));

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

    it('shows the table row with content', async () => {
        listRowWrapper(
            <AasListTableRow
                repositoryUrl={'https://test-repository.de'}
                aasListEntry={listEntry}
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
});
