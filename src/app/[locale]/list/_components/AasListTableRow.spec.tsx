import { expect } from '@jest/globals';
import { CustomRender } from 'test-utils/CustomRender';
import { screen, waitFor } from '@testing-library/react';
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
        listRowWrapper(
            <AasListTableRow
                repository={repository}
                aasListEntry={listEntry1}
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
        listRowWrapper(
            <AasListTableRow
                repository={repository}
                aasListEntry={listEntry2}
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

    it('uses resolvedRepositoryUrl for data fetching when loaded from registry', async () => {
        const resolvedRepoUrl = 'https://resolved-aas-repo.example.com';
        const registryUrl = 'https://registry.example.com';
        const registryRepository: RepositoryWithInfrastructure = {
            url: registryUrl,
            infrastructureName: 'TestRegistry',
            id: 'test-registry-id',
        };
        const registryEntry: ListEntityDto = {
            aasId: 'registryAasId',
            thumbnail: '',
            assetId: 'registryAssetId',
            resolvedRepositoryUrl: resolvedRepoUrl,
        };
        (nameplateDataActions.getNameplateValuesForAAS as jest.Mock).mockImplementation(
            jest.fn(() => {
                return {
                    success: true,
                    manufacturerName: [{ en: 'RegistryManufacturer' }],
                    manufacturerProductDesignation: [{ en: 'RegistryProduct' }],
                };
            }),
        );
        listRowWrapper(
            <AasListTableRow
                repository={registryRepository}
                connectionType="registry"
                aasListEntry={registryEntry}
                checkBoxDisabled={() => undefined}
                comparisonFeatureFlag={true}
                selectedAasList={undefined}
                updateSelectedAasList={() => undefined}
            />,
        );

        await waitFor(() => screen.getByTestId('list-manufacturer-name'));
        expect(screen.getByTestId('list-manufacturer-name')).toHaveTextContent('RegistryManufacturer');
        expect(screen.getByTestId('list-product-designation')).toHaveTextContent('RegistryProduct');

        // Verify getNameplateValuesForAAS was called with the resolved repo URL, not the registry URL
        expect(nameplateDataActions.getNameplateValuesForAAS).toHaveBeenCalledWith(
            expect.objectContaining({ url: resolvedRepoUrl }),
            'registryAasId',
        );
    });

    it('uses original repository URL when resolvedRepositoryUrl is not set', async () => {
        const listEntry: ListEntityDto = {
            aasId: 'repoAasId',
            thumbnail: '',
            assetId: 'repoAssetId',
        };
        (nameplateDataActions.getNameplateValuesForAAS as jest.Mock).mockImplementation(
            jest.fn(() => {
                return {
                    success: true,
                    manufacturerName: [{ en: 'RepoManufacturer' }],
                    manufacturerProductDesignation: [{ en: 'RepoProduct' }],
                };
            }),
        );
        listRowWrapper(
            <AasListTableRow
                repository={repository}
                connectionType="repository"
                aasListEntry={listEntry}
                checkBoxDisabled={() => undefined}
                comparisonFeatureFlag={true}
                selectedAasList={undefined}
                updateSelectedAasList={() => undefined}
            />,
        );

        await waitFor(() => screen.getByTestId('list-manufacturer-name'));
        expect(nameplateDataActions.getNameplateValuesForAAS).toHaveBeenCalledWith(
            expect.objectContaining({ url: repository.url }),
            'repoAasId',
        );
    });
});
