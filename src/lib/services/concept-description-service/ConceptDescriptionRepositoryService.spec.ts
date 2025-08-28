import {
    getDefaultInfrastructure,
    getInfrastructureByName,
    getInfrastructuresIncludingDefault,
} from '../database/infrastructureDatabaseActions';
import { ConceptDescriptionRepositoryService } from './ConceptDescriptionRepositoryService';

jest.mock('../database/infrastructureDatabaseActions', () => ({
    getInfrastructuresIncludingDefault: jest.fn(),
    getDefaultInfrastructure: jest.fn(),
    getInfrastructureByName: jest.fn(),
}));

const infrastructures = [
    {
        name: 'test1',
        discoveryUrls: ['https://discovery1.com'],
        aasRegistryUrls: ['https://registry1.com'],
        aasRepositoryUrls: ['https://repository1.com'],
        conceptDescriptionRepositoryUrls: ['https://conceptDescriptionRepo1.com'],
    },
    {
        name: 'default',
        discoveryUrls: ['https://default-discovery1.com'],
        aasRegistryUrls: ['https://default-registry1.com'],
        aasRepositoryUrls: ['https://default-repository1.com'],
        conceptDescriptionRepositoryUrls: ['https://default-conceptDescriptionRepo1.com'],
    },
];

describe('ConceptDescriptionRepositoryService', () => {
    beforeEach(() => {
        jest.clearAllMocks();
        (getInfrastructuresIncludingDefault as jest.Mock).mockResolvedValue(infrastructures);

        (getDefaultInfrastructure as jest.Mock).mockResolvedValue(
            infrastructures.filter((infra) => infra.name === 'default')[0],
        );

        (getInfrastructureByName as jest.Mock).mockImplementation((name: string) => {
            return infrastructures.find((infra) => infra.name === name);
        });
    });

    it('fetches concept description by ID from the specified infrastructure', async () => {
        const service = ConceptDescriptionRepositoryService.createNull([
            {
                searchResult: {
                    id: 'cd-1',
                    modelType: 'ConceptDescription',
                },
                location: 'https://conceptDescriptionRepo1.com',
                infrastructureName: 'test1',
            },
        ]);

        const result = await service.getConceptDescriptionByIdFromInfrastructure('cd-1', 'test1');
        expect(result.isSuccess).toBe(true);
        expect(result.result?.id).toBe('cd-1');
    });

    it('fetches concept description by ID from the specified infrastructure with multiple results', async () => {
        const service = ConceptDescriptionRepositoryService.createNull([
            {
                searchResult: {
                    id: 'cd-1',
                    modelType: 'ConceptDescription',
                },
                location: 'https://conceptDescriptionRepo1.com',
                infrastructureName: 'test1',
            },
            {
                searchResult: {
                    id: 'cd-1',
                    modelType: 'ConceptDescription',
                },
                location: 'https://conceptDescriptionRepo2.com',
                infrastructureName: 'test1',
            },
            {
                searchResult: {
                    id: 'cd-1',
                    modelType: 'ConceptDescription',
                },
                location: 'https://conceptDescriptionRepo2.com',
                infrastructureName: 'test1',
            },
        ]);

        const result = await service.getConceptDescriptionByIdFromInfrastructure('cd-1', 'test1');
        expect(result.isSuccess).toBe(true);
        expect(result.result?.id).toBe('cd-1');
    });
    it('does not fetch concept description by ID from the specified infrastructure if id not available', async () => {
        const service = ConceptDescriptionRepositoryService.createNull([
            {
                searchResult: {
                    id: 'cd-1',
                    modelType: 'ConceptDescription',
                },
                location: 'https://conceptDescriptionRepo1.com',
                infrastructureName: 'test1',
            },
        ]);

        const result = await service.getConceptDescriptionByIdFromInfrastructure('cd-2', 'test1');
        expect(result.isSuccess).toBe(false);
    });

    it('does not fetch concept description by ID from the specified infrastructure if infrastructure not available', async () => {
        const service = ConceptDescriptionRepositoryService.createNull([
            {
                searchResult: {
                    id: 'cd-1',
                    modelType: 'ConceptDescription',
                },
                location: 'https://conceptDescriptionRepo1.com',
                infrastructureName: 'test1',
            },
        ]);

        const result = await service.getConceptDescriptionByIdFromInfrastructure('cd-1', 'default');
        expect(result.isSuccess).toBe(false);
    });
});
