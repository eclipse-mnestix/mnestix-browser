import { expect } from '@jest/globals';
import { CustomRender } from 'test-utils/CustomRender';
import { fireEvent, screen, waitFor } from '@testing-library/react';
import { AasListTableRow } from 'app/[locale]/list/_components/AasListTableRow';
import { ListEntityDto } from 'lib/services/list-service/ListService';
import * as nameplateDataActions from 'lib/services/list-service/aasListApiActions';
import { JSX } from 'react';
import { AasStoreProvider } from 'stores/AasStore';
import { RepositoryWithInfrastructure } from 'lib/services/database/InfrastructureMappedTypes';

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
jest.mock('./../../../../lib/services/aas-repository-service/aasRepositoryActions', () => ({
    getThumbnailFromShell: jest.fn(() => Promise.resolve({ success: true, result: { fileType: '', fileContent: '' } })),
}));
describe('AasListTableRow', () => {
    const repository: RepositoryWithInfrastructure = {
        url: 'https://test-repository.de/repo',
        infrastructureName: 'Test',
        id: 'test-repo-id',
    };

    const listRowWrapper = (children: JSX.Element) => {
        CustomRender(
            <AasStoreProvider>
                <table>
                    <tbody>
                        <tr>{children}</tr>
                    </tbody>
                </table>
            </AasStoreProvider>,
        );
    };

    beforeEach(() => {
        jest.resetAllMocks();
    });

    it('shows the table row with content in english', async () => {
        const listEntry1: ListEntityDto = {
            aasId: 'aasId1',
            thumbnail: '',
            assetId: 'assetId',
        };
        (nameplateDataActions.getNameplateValuesForAAS as jest.Mock).mockImplementation(
            jest.fn(() => {
                return {
                    success: true,
                    manufacturerName: [{ de: 'ManufacturerDE' }, { en: 'ManufacturerEN' }],
                    manufacturerProductDesignation: [{ de: 'ProductDesignationDE' }, { en: 'ProductDesignationEN' }],
                };
            }),
        );
        listRowWrapper(<AasListTableRow repository={repository} aasListEntry={listEntry1} />);

        await waitFor(() => screen.getByTestId('list-thumbnail'));
        expect(screen.getByTestId('list-thumbnail')).toBeInTheDocument();
        expect(screen.getByTestId('list-manufacturer-name')).toHaveTextContent('ManufacturerEN');
        expect(screen.getByTestId('list-product-designation')).toHaveTextContent('ProductDesignationEN');
        expect(screen.getByTestId('list-assetId')).toHaveTextContent('assetId');
        expect(screen.getByTestId('list-aasId')).toHaveTextContent('aasId');
        expect(screen.getByTestId('list-to-detailview-button')).toBeInTheDocument();
    });

    it('shows the table row without nameplate content', async () => {
        const listEntry2: ListEntityDto = {
            aasId: 'aasId2',
            thumbnail: '',
            assetId: 'assetId',
        };
        (nameplateDataActions.getNameplateValuesForAAS as jest.Mock).mockImplementation(
            jest.fn(() => {
                return {
                    success: true,
                    manufacturerName: [],
                    manufacturerProductDesignation: [],
                };
            }),
        );
        listRowWrapper(<AasListTableRow repository={repository} aasListEntry={listEntry2} />);
        await waitFor(() => screen.getByTestId('list-thumbnail'));
        expect(screen.getByTestId('list-thumbnail')).toBeInTheDocument();
        expect(screen.getByTestId('list-manufacturer-name')).toHaveTextContent('');
        expect(screen.getByTestId('list-product-designation')).toHaveTextContent('');
        expect(screen.getByTestId('list-assetId')).toHaveTextContent('assetId');
        expect(screen.getByTestId('list-aasId')).toHaveTextContent('aasId2');
        expect(screen.getByTestId('list-to-detailview-button')).toBeInTheDocument();
    });

    it('opens the viewer in the current language', async () => {
        const windowOpenSpy = jest.spyOn(window, 'open').mockImplementation(() => null);
        const listEntry: ListEntityDto = {
            aasId: 'aasId1',
            thumbnail: '',
            assetId: 'assetId',
        };
        (nameplateDataActions.getNameplateValuesForAAS as jest.Mock).mockImplementation(
            jest.fn(() => {
                return {
                    success: true,
                    manufacturerName: [],
                    manufacturerProductDesignation: [],
                };
            }),
        );
        CustomRender(
            <AasStoreProvider>
                <table>
                    <tbody>
                        <tr>
                            <AasListTableRow repository={repository} aasListEntry={listEntry} />
                        </tr>
                    </tbody>
                </table>
            </AasStoreProvider>,
            { locale: 'de' },
        );

        await waitFor(() => screen.getByTestId('list-to-detailview-button'));
        fireEvent.click(screen.getByTestId('list-to-detailview-button'));

        expect(windowOpenSpy).toHaveBeenCalledWith(expect.stringContaining('/de/viewer/'), '_blank');
    });
});
