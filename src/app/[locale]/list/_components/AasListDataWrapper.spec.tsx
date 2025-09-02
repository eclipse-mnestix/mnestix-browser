import { CustomRender } from 'test-utils/CustomRender';
import { fireEvent, screen, waitFor } from '@testing-library/react';
import { expect } from '@jest/globals';
import AasListDataWrapper from 'app/[locale]/list/_components/AasListDataWrapper';
import * as serverActions from 'lib/services/list-service/aasListApiActions';
import * as nameplateDataActions from 'lib/services/list-service/aasListApiActions';
import * as connectionServerActions from 'lib/services/database/infrastructureDatabaseActions';
import { ListEntityDto } from 'lib/services/list-service/ListService';
import { Internationalization } from 'lib/i18n/Internationalization';
import { AasStoreProvider } from 'stores/AasStore';
import { RepositoryWithInfrastructure } from 'lib/services/database/InfrastructureMappedTypes';

jest.mock('./../../../../lib/services/list-service/aasListApiActions');
jest.mock('./../../../../lib/services/database/infrastructureDatabaseActions');
jest.mock('./../../../../lib/services/aas-repository-service/aasRepositoryActions', () => ({
    getThumbnailFromShell: jest.fn(() => Promise.resolve({ success: true, result: { fileType: '', fileContent: '' } })),
}));
jest.mock('next/navigation', () => ({
    useRouter() {
        return {
            prefetch: () => null,
        };
    },
    useParams() {
        return {};
    },
    useSearchParams() {
        return {
            get: jest.fn(),
        };
    },
}));
jest.mock('next-auth', jest.fn());

const REPOSITORY_URL = 'https://test-repository.de';
const FIRST_PAGE_CURSOR = '123123';
const REPOSITORY = { url: REPOSITORY_URL, infrastructureName: 'Test Infrastructure', id: 'test-repo-id' };
const mockDB = jest.fn(() => {
    return [REPOSITORY];
});

const createTestListEntries = (from = 0, to = 10): ListEntityDto[] => {
    const objects: ListEntityDto[] = [];

    for (let i = from; i < to; i++) {
        const obj: ListEntityDto = {
            aasId: `aasid${i}`,
            assetId: `assetId${i}`,
            thumbnail: '',
        };

        objects.push(obj);
    }

    return objects;
};

const mockActionFirstPage = jest.fn(
    (_repository: RepositoryWithInfrastructure, _count: number, _cursor: string | undefined) => {
        return {
            success: true,
            entities: createTestListEntries(0, 10),
            cursor: FIRST_PAGE_CURSOR,
            error: {},
        };
    },
);

const mockActionSecondPage = jest.fn(
    (_repository: RepositoryWithInfrastructure, _count: number, _cursor: string | undefined) => {
        return {
            success: true,
            entities: createTestListEntries(10, 12),
            cursor: undefined,
            error: {},
        };
    },
);

const mockNameplateData = jest.fn(() => {
    return {
        success: true,
        manufacturerName: [],
        manufacturerProductDesignation: [],
    };
});

describe('AASListDataWrapper', () => {
    beforeEach(async () => {
        (serverActions.getAasListEntities as jest.Mock).mockImplementation(mockActionFirstPage);

        (connectionServerActions.getAasRepositoriesIncludingDefault as jest.Mock).mockImplementation(mockDB);
        (nameplateDataActions.getNameplateValuesForAAS as jest.Mock).mockImplementation(mockNameplateData);

        CustomRender(
            <Internationalization>
                <AasStoreProvider>
                    <AasListDataWrapper />
                </AasStoreProvider>
            </Internationalization>,
        );

        await waitFor(() => screen.getByTestId('repository-select'));
    });

    describe('Pagination', () => {
        beforeEach(async () => {
            // Choose a repository
            await waitFor(() => screen.getByTestId('repository-select'));
            const select = screen.getAllByRole('combobox')[0];
            fireEvent.mouseDown(select);
            const firstElement = screen.getAllByRole('option')[0];
            fireEvent.click(firstElement);

            await waitFor(() => screen.getByTestId('list-next-button'));
        });

        it('Should disable the back button on the first page', async () => {
            const backButton = await waitFor(() => screen.getByTestId('list-back-button'));
            expect(screen.getByText('assetId1', { exact: false })).toBeInTheDocument();
            expect(backButton).toBeDisabled();
        });

        it('Loads the next page with the provided cursor', async () => {
            // go to second page
            (serverActions.getAasListEntities as jest.Mock).mockImplementation(mockActionSecondPage);
            const nextButton = await waitFor(() => screen.getByTestId('list-next-button'));
            await waitFor(async () => nextButton.click());

            expect(screen.getByText('assetId10', { exact: false })).toBeInTheDocument();
            expect(screen.getByText('Page 2', { exact: false })).toBeInTheDocument();
            expect(screen.getByTestId('list-next-button')).toBeDisabled();
            expect(mockActionSecondPage).toHaveBeenCalledWith(REPOSITORY, 10, FIRST_PAGE_CURSOR);
        });

        it('Navigates one page back when clicking on the back button', async () => {
            // go to second page
            (serverActions.getAasListEntities as jest.Mock).mockImplementation(mockActionSecondPage);
            const nextButton = await waitFor(() => screen.getByTestId('list-next-button'));
            await waitFor(async () => nextButton.click());

            // back to first page
            (serverActions.getAasListEntities as jest.Mock).mockImplementation(mockActionFirstPage);
            const backButton = await waitFor(() => screen.getByTestId('list-back-button'));
            await waitFor(async () => backButton.click());

            expect(screen.getByText('assetId3', { exact: false })).toBeInTheDocument();
            expect(screen.getByText('Page 1', { exact: false })).toBeInTheDocument();
            expect(mockActionFirstPage).toHaveBeenCalledWith(REPOSITORY, 10, undefined);
        });
    });
});
