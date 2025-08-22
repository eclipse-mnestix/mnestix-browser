import { expect } from '@jest/globals';
import { SubmodelDescriptor } from 'lib/types/registryServiceTypes';
import { Submodel } from 'lib/api/aas/models';
import { encodeBase64 } from 'lib/util/Base64Util';
import { Log } from 'lib/util/Log';
import { InfrastructureSearchService } from 'lib/services/infrastructure-search-service/InfrastructureSearchService';
import { getInfrastructuresIncludingDefault } from 'lib/services/database/infrastructureDatabaseActions';
import {
    createTestAas,
    createTestShellDescriptor,
    createTestSubmodel,
    createTestSubmodelDescriptor,
    createTestSubmodelRef,
} from 'test-utils/TestUtils';

jest.mock('./../database/connectionServerActions');

const AAS_ENDPOINT = new URL('https://www.origin.com/route/for/aas/');

describe('Full Aas Search happy paths', () => {
    beforeEach(() => {
        jest.clearAllMocks();
        (getInfrastructuresIncludingDefault as jest.Mock).mockResolvedValue([
            {
                name: 'Test Infrastructure',
                discoveryUrls: ['https://discovery1.com'],
                aasRegistryUrls: ['https://registry1.com'],
                aasRepositoryUrls: ['https://repository1.com'],
            },
        ]);
    });

    it('navigates to the discovery list when more than one aasId for a given assetId', async () => {
        (getInfrastructuresIncludingDefault as jest.Mock).mockResolvedValue([
            {
                name: 'Test Infrastructure',
                discoveryUrls: ['https://discovery1.com', 'https://discovery2.com'],
                aasRegistryUrls: [],
                aasRepositoryUrls: [],
            },
        ]);
        const searchString = 'irrelevant assetId';
        const log = Log.createNull();
        const tracker = log.getTracker();
        const searcher = InfrastructureSearchService.createNull({
            discoveryEntries: [
                { assetId: searchString, aasId: 'first found aasId 0' },
                { assetId: searchString, aasId: 'second found aasId 1' },
            ],
        });

        const search = await searcher.searchAASInAllInfrastructures(searchString);

        expect(search.isSuccess).toBeTruthy();
        expect(search.result!.redirectUrl).toBe('/viewer/discovery?assetId=' + searchString);
        expect(tracker.getData()).toHaveLength(0);
    });

    it('returns redirect to aas when exactly one aasId for a given assetId and it is registered in a registry', async () => {
        const aasId = 'dummy aasId';
        const searchString = 'irrelevant assetId';
        const aas = createTestAas(aasId);
        const searcher = InfrastructureSearchService.createNull({
            discoveryEntries: [{ assetId: searchString, aasId: aasId }],
            aasRegistryDescriptors: [createTestShellDescriptor(AAS_ENDPOINT, aasId)],
            aasRegistryEndpoints: [{ endpoint: AAS_ENDPOINT, aas: aas }],
        });

        const search = await searcher.searchAASInAllInfrastructures(searchString);

        expect(search.isSuccess).toBeTruthy();
        expect(search.result!.redirectUrl).toBe('/viewer/' + encodeBase64(aasId));
        expect(search.result!.aas?.id).toEqual(aas.id);
    });

    it('returns redirect to aas when exactly one aasId for a given assetId and it is not registered in the registry but saved in a repository', async () => {
        const aasId = 'dummy aasId';
        const searchString = 'irrelevant assetId';
        const testUrl = 'https://repository1.com';
        const aas = createTestAas(aasId);
        const searcher = InfrastructureSearchService.createNull({
            discoveryEntries: [{ assetId: searchString, aasId: aasId }],
            aasInRepositories: [{ searchResult: aas, location: testUrl }],
        });

        const search = await searcher.searchAASInAllInfrastructures(searchString);

        expect(search.isSuccess).toBeTruthy();
        expect(search.result!.redirectUrl).toBe('/viewer/' + encodeBase64(aasId));
        expect(search.result!.aas?.id).toEqual(aas.id);
    });

    it('returns redirect to aas when discovery returns nothing and the aas is registered in the registry', async () => {
        const aasId = 'dummy aasId';
        const searchString = aasId;
        const aas = createTestAas(aasId);
        const searcher = InfrastructureSearchService.createNull({
            aasRegistryDescriptors: [createTestShellDescriptor(AAS_ENDPOINT, aasId)],
            aasRegistryEndpoints: [{ endpoint: AAS_ENDPOINT, aas: aas }],
        });

        const search = await searcher.searchAASInAllInfrastructures(searchString);

        expect(search.isSuccess).toBeTruthy();
        expect(search.result!.redirectUrl).toBe('/viewer/' + encodeBase64(aasId));
        expect(search.result!.aas?.id).toEqual(aas.id);
    });

    it('returns redirect to aas for given aasId from repository', async () => {
        const aasId = 'dummy aasId';
        const searchString = aasId;
        const testUrl = 'https://repository1.com';
        const aas = createTestAas(aasId);
        const searcher = InfrastructureSearchService.createNull({
            aasInRepositories: [{ searchResult: aas, location: testUrl }],
        });

        const search = await searcher.searchAASInAllInfrastructures(searchString);

        expect(search.isSuccess).toBeTruthy();
        expect(search.result!.redirectUrl).toBe('/viewer/' + encodeBase64(aasId));
        expect(search.result!.aas?.id).toEqual(aas.id);
    });

    it('returns redirect to list for given aasId if two aas are found', async () => {
        jest.clearAllMocks();
        (getInfrastructuresIncludingDefault as jest.Mock).mockResolvedValue([
            {
                name: 'Test Infrastructure',
                discoveryUrls: ['https://discovery1.com'],
                aasRegistryUrls: ['https://registry1.com'],
                aasRepositoryUrls: ['https://testrepo1.com', 'https://testrepo2.com'],
            },
        ]);

        const aasId = 'dummy aasId';
        const searchString = aasId;
        const searcher = InfrastructureSearchService.createNull({
            aasInRepositories: [
                { searchResult: createTestAas(aasId), location: 'https://testrepo1.com' },
                { searchResult: createTestAas(aasId), location: 'https://testrepo2.com' },
            ],
        });

        const search = await searcher.searchAASInAllInfrastructures(searchString);

        expect(search.isSuccess).toBeTruthy();
        expect(search.result!.redirectUrl).toBe('/viewer/registry?aasId=' + searchString);
    });

    it('returns redirect to registry list for given aasId if two aas are found', async () => {
        jest.clearAllMocks();
        (getInfrastructuresIncludingDefault as jest.Mock).mockResolvedValue([
            {
                name: 'Test Infrastructure',
                discoveryUrls: [],
                aasRegistryUrls: ['https://registry1.com', 'https://registry2.com'],
                aasRepositoryUrls: [],
            },
        ]);

        const aasId = 'dummy aasId';
        const searchString = aasId;
        const searcher = InfrastructureSearchService.createNull({
            aasRegistryDescriptors: [createTestShellDescriptor(AAS_ENDPOINT, aasId)],
            aasRegistryEndpoints: [{ endpoint: AAS_ENDPOINT, aas: createTestAas(aasId) }],
        });

        const search = await searcher.searchAASInAllInfrastructures(searchString);

        expect(search.isSuccess).toBeTruthy();
        expect(search.result!.redirectUrl).toBe('/viewer/registry?aasId=' + searchString);
    });
});

describe('Full Aas Search edge cases', () => {
    it('logs to the console when finding nothing', async () => {
        const searchString = 'irrelevant assetId';
        const searcher = InfrastructureSearchService.createNull({});

        await assertThatFunctionThrows(searcher, searchString);
    });

    it('throws when registry search failed', async () => {
        const searchString = 'irrelevant assetId';
        const aasId = 'irrelevantAasId';
        const searcher = InfrastructureSearchService.createNull({
            discoveryEntries: [{ assetId: searchString, aasId: aasId }],
            aasRegistryDescriptors: [createTestShellDescriptor(AAS_ENDPOINT, aasId)],
            aasInRepositories: [
                {
                    searchResult: createTestAas(aasId),
                    location: AAS_ENDPOINT + 'wrong path',
                },
            ],
        });

        await assertThatFunctionThrows(searcher, searchString);
    });

    it('throws when discovery search failed', async () => {
        const searchString = 'irrelevant assetId';
        const aasId = 'irrelevantAasId';
        const searcher = InfrastructureSearchService.createNull({
            discoveryEntries: [{ assetId: 'wrong asset Id', aasId: aasId }],
            aasRegistryDescriptors: [createTestShellDescriptor(AAS_ENDPOINT, aasId)],
            aasInRepositories: [
                {
                    searchResult: createTestAas(aasId),
                    location: AAS_ENDPOINT + 'wrong path',
                },
            ],
        });

        await assertThatFunctionThrows(searcher, searchString);
    });
});

describe('Submodel Search happy paths', () => {
    beforeEach(() => {
        jest.clearAllMocks();
        (getInfrastructuresIncludingDefault as jest.Mock).mockResolvedValue([
            {
                name: 'Test Infrastructure',
                submodelRepositoryUrls: ['https://repository1.com'],
                submodelRegistryUrls: ['https://registry1.com'],
            },
        ]);
    });

    it('returns submodel if submodel was found in a submodel repository', async () => {
        const submodelRef = createTestSubmodelRef('https://test.de/submodel1');
        const submodel: Submodel = createTestSubmodel('https://test.de/submodel1', 'submodel1');

        const testUrl = 'https://repository1.com';
        const searcher = InfrastructureSearchService.createNull({
            submodelsInRepositories: [{ searchResult: submodel, location: testUrl }],
        });

        const search = await searcher.searchSubmodelInInfrastructure(submodelRef, 'Test Infrastructure');

        expect(search.isSuccess).toBeTruthy();
        expect(search.result!.searchResult.id).toBe(submodelRef.keys[0].value);
    });

    it('returns submodel for given submodel descriptor', async () => {
        const submodelRef = createTestSubmodelRef('https://test.de/submodel1');
        const submodel: Submodel = createTestSubmodel('https://test.de/submodel1', 'submodel1');

        const submodelDescriptor: SubmodelDescriptor = createTestSubmodelDescriptor(
            new URL('https://test.de/submodel1/endpoint'),
            submodel.id,
        );

        const searcher = InfrastructureSearchService.createNull({
            submodelRegistryDescriptors: [submodelDescriptor],
        });
        const search = await searcher.searchSubmodelInInfrastructure(
            submodelRef,
            'Test Infrastructure',
            submodelDescriptor,
        );

        expect(search.isSuccess).toBe(true);
        expect(search.result!.searchResult.id).toBe(submodelRef.keys[0].value);
    });

    it('returns submodel if submodel was found in a submodel registry', async () => {
        const submodelRef = createTestSubmodelRef('https://test.de/submodel1');
        const submodel: Submodel = createTestSubmodel('https://test.de/submodel1', 'submodel1');

        const submodelDescriptor: SubmodelDescriptor = createTestSubmodelDescriptor(
            new URL('https://test.de/submodel1/endpoint'),
            submodel.id,
        );

        const searcher = InfrastructureSearchService.createNull({
            submodelRegistryDescriptors: [submodelDescriptor],
        });
        const search = await searcher.searchSubmodelInInfrastructure(submodelRef, 'Test Infrastructure');

        expect(search.isSuccess).toBeTruthy();
        expect(search.result!.searchResult.id).toBe(submodelRef.keys[0].value);
    });

    it('returns an error when submodel was not found in any repository or registry', async () => {
        const submodelRef = createTestSubmodelRef('https://test.de/submodel1');

        const searcher = InfrastructureSearchService.createNull({});
        const search = await searcher.searchSubmodelInInfrastructure(submodelRef, 'Test Infrastructure');

        expect(search.isSuccess).toBeFalsy();
        if (!search.isSuccess) {
            expect(search.errorCode).toContain('NOT_FOUND');
        }
    });
});

async function assertThatFunctionThrows(
    searcher: InfrastructureSearchService,
    searchString: string,
    partOfExpectedErrorMessage: string | null = null,
) {
    try {
        await searcher.searchAASInAllInfrastructures(searchString);
        fail('Your method was expected to throw but did not throw at all.');
    } catch (e) {
        if (partOfExpectedErrorMessage) {
            expect(e).toContain(partOfExpectedErrorMessage);
        }
    }
}
