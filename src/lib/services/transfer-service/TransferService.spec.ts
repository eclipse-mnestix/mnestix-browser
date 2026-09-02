import { expect } from '@jest/globals';
import { TransferService } from 'lib/services/transfer-service/TransferService';
import testData from './TransferService.data.json';
import { AssetAdministrationShell, Submodel } from 'lib/api/aas/models';
import {
    createShellDescriptorFromAas,
    createSubmodelDescriptorFromSubmodel,
} from 'lib/services/transfer-service/TransferUtil';
import { TransferAas, TransferResult, TransferServiceConfig, TransferSubmodel } from 'lib/types/TransferServiceData';
import ServiceReachable, { createTestInfrastructure } from 'test-utils/TestUtils';
import { assertEgressAllowed, securityHeadersForUrl } from 'lib/util/securityHelpers/repositoryFetchGuard';
import { getInfrastructureByName } from 'lib/services/database/infrastructureDatabaseActions';
import { mnestixFetch } from 'lib/api/infrastructure';

jest.mock('lib/util/securityHelpers/repositoryFetchGuard', () => ({
    assertEgressAllowed: jest.fn(),
    securityHeadersForUrl: jest.fn(),
}));
jest.mock('lib/services/database/infrastructureDatabaseActions');
jest.mock('lib/api/infrastructure', () => ({
    mnestixFetch: jest.fn(),
}));

const assertEgressAllowedMock = assertEgressAllowed as jest.Mock;
const securityHeadersForUrlMock = securityHeadersForUrl as jest.Mock;
const getInfrastructureByNameMock = getInfrastructureByName as jest.Mock;
const mnestixFetchMock = mnestixFetch as jest.Mock;

const aas = testData.transferAas as unknown as AssetAdministrationShell;
const transferAas = { aas: aas, originalAasId: aas.id } as TransferAas;
const nameplate = testData.transferSubmodelNameplate as unknown as Submodel;
const transferNameplate = { submodel: nameplate, originalSubmodelId: nameplate.id } as TransferSubmodel;
const technical = testData.transferSubmodelTechnicalData as unknown as Submodel;
const transferTechnical = { submodel: technical, originalSubmodelId: technical.id } as TransferSubmodel;

// TODO Replace bitmagic with simpler string comparison
// TODO add more expressive error information: which result failed: https://github.com/mattphillips/jest-expect-message
const checkNthBinaryDigit = (number: number, digit: number) => ((number >>> digit) & 1) == 1;

function expectTransferResult(result: TransferResult[], successMask: number = 0xffff) {
    result.forEach((value, index) => {
        const expected = checkNthBinaryDigit(successMask, result.length - index - 1);
        expect(value.success).toBe(expected);
    });
}

describe('TransferService: Export AAS', function () {
    beforeEach(() => {
        assertEgressAllowedMock.mockReset();
        assertEgressAllowedMock.mockResolvedValue(undefined);
    });

    it('All services given', async () => {
        const service = TransferService.createNull({
            targetAasRepository: ServiceReachable.Yes,
            sourceAasRepository: ServiceReachable.Yes,
            targetSubmodelRepository: ServiceReachable.Yes,
            sourceSubmodelRepository: ServiceReachable.Yes,
            targetAasDiscovery: ServiceReachable.Yes,
            targetAasRegistry: ServiceReachable.Yes,
            targetSubmodelRegistry: ServiceReachable.Yes,
            sourceAasEntries: [aas],
            sourceSubmodelEntries: [nameplate, technical],
        });

        const transferResult = await service.transferAasWithSubmodels(
            transferAas,
            [transferNameplate, transferTechnical],
            0,
        );

        // Should include AAS repo, registry, thumbnail, discovery; submodel repo, registry, file
        expect(transferResult).toHaveLength(7);
        expectTransferResult(transferResult, 0b1111111);

        // Should return results in a fixed order
        expect(transferResult[0].operationKind).toBe('AasRepository');
        expect(transferResult[1].operationKind).toBe('Discovery');
        expect(transferResult[2].operationKind).toBe('AasRegistry');
        expect(transferResult[3].operationKind).toBe('SubmodelRepository');
        expect(transferResult[4].operationKind).toBe('SubmodelRepository');
        expect(transferResult[5].operationKind).toBe('SubmodelRegistry');
        expect(transferResult[6].operationKind).toBe('SubmodelRegistry');
    });

    it('Only repositories given', async () => {
        const service = TransferService.createNull({
            targetAasRepository: ServiceReachable.Yes,
            sourceAasRepository: ServiceReachable.Yes,
            targetSubmodelRepository: ServiceReachable.Yes,
            sourceSubmodelRepository: ServiceReachable.Yes,
            sourceAasEntries: [aas],
            sourceSubmodelEntries: [nameplate, technical],
        });

        const transferResult = await service.transferAasWithSubmodels(
            transferAas,
            [transferNameplate, transferTechnical],
            0,
        );

        // Should have no errors; registries and discovery not in return list
        expect(transferResult).toHaveLength(3);
        expectTransferResult(transferResult, 0b111);
    });

    it('Cannot reach aas repository service', async function () {
        const service = TransferService.createNull({
            targetAasRepository: ServiceReachable.No,
            sourceAasRepository: ServiceReachable.Yes,
            targetSubmodelRepository: ServiceReachable.Yes,
            sourceSubmodelRepository: ServiceReachable.Yes,
            targetAasDiscovery: ServiceReachable.Yes,
            targetAasRegistry: ServiceReachable.Yes,
            targetSubmodelRegistry: ServiceReachable.Yes,
            sourceAasEntries: [aas],
            sourceSubmodelEntries: [nameplate, technical],
        });

        const transferResult = await service.transferAasWithSubmodels(
            transferAas,
            [transferNameplate, transferTechnical],
            0,
        );

        // Should only error on AAS repository but copy everything else
        expectTransferResult(transferResult, 0b0111111);
    });

    it('Cannot reach Discovery service', async function () {
        const service = TransferService.createNull({
            targetAasRepository: ServiceReachable.Yes,
            sourceAasRepository: ServiceReachable.Yes,
            targetSubmodelRepository: ServiceReachable.Yes,
            sourceSubmodelRepository: ServiceReachable.Yes,
            targetAasDiscovery: ServiceReachable.No,
            targetAasRegistry: ServiceReachable.Yes,
            targetSubmodelRegistry: ServiceReachable.Yes,
            sourceAasEntries: [aas],
            sourceSubmodelEntries: [nameplate, technical],
        });

        const transferResult = await service.transferAasWithSubmodels(
            transferAas,
            [transferNameplate, transferTechnical],
            0,
        );

        // Should copy submodels, repository and registry; error on discovery
        const discoveryResult = transferResult.find((value) => value.operationKind == 'Discovery');
        expect(discoveryResult).not.toBeUndefined();
        expect(!discoveryResult!.success).toBe(true);
        expectTransferResult(transferResult, 0b1011111);
    });

    it('Cannot reach AAS Registry service', async function () {
        const service = TransferService.createNull({
            targetAasRepository: ServiceReachable.Yes,
            sourceAasRepository: ServiceReachable.Yes,
            targetSubmodelRepository: ServiceReachable.Yes,
            sourceSubmodelRepository: ServiceReachable.Yes,
            targetAasDiscovery: ServiceReachable.Yes,
            targetAasRegistry: ServiceReachable.No,
            targetSubmodelRegistry: ServiceReachable.Yes,
            sourceAasEntries: [aas],
            sourceSubmodelEntries: [nameplate, technical],
        });

        const transferResult = await service.transferAasWithSubmodels(
            transferAas,
            [transferNameplate, transferTechnical],
            0,
        );

        // Should copy submodels, repository and discovery; error on registry
        const discoveryResults = transferResult.filter((value) => value.operationKind == 'AasRegistry');
        expect(discoveryResults).toHaveLength(1);
        expect(discoveryResults[0].success).toBe(false);
        expectTransferResult(transferResult, 0b1101111);
    });

    it('Cannot reach submodel repository service', async function () {
        const service = TransferService.createNull({
            targetAasRepository: ServiceReachable.Yes,
            sourceAasRepository: ServiceReachable.Yes,
            targetSubmodelRepository: ServiceReachable.No,
            sourceSubmodelRepository: ServiceReachable.Yes,
            targetAasDiscovery: ServiceReachable.Yes,
            targetAasRegistry: ServiceReachable.Yes,
            targetSubmodelRegistry: ServiceReachable.Yes,
            sourceAasEntries: [aas],
            sourceSubmodelEntries: [nameplate, technical],
        });

        const transferResult = await service.transferAasWithSubmodels(
            transferAas,
            [transferNameplate, transferTechnical],
            0,
        );

        // Should copy AAS in repo, registry, discovery; submodels fail in repo but work in registry
        expectTransferResult(transferResult, 0b1110011);
    });

    it('Not all submodels are selected for copying', async function () {
        const service = TransferService.createNull({
            targetAasRepository: ServiceReachable.Yes,
            sourceAasRepository: ServiceReachable.Yes,
            targetSubmodelRepository: ServiceReachable.Yes,
            sourceSubmodelRepository: ServiceReachable.Yes,
            targetAasDiscovery: ServiceReachable.Yes,
            targetAasRegistry: ServiceReachable.Yes,
            targetSubmodelRegistry: ServiceReachable.Yes,
            sourceAasEntries: [aas],
            sourceSubmodelEntries: [nameplate, technical],
        });

        await service.transferAasWithSubmodels(transferAas, [transferNameplate], 0);

        // Should only put selected submodels and data into aas submodel properties; rest should not be in return list
        const targetSubmodelRepo = service.targetSubmodelRepositoryClient;
        expect((await targetSubmodelRepo.getSubmodelById(nameplate.id)).isSuccess);
        expect(!(await targetSubmodelRepo.getSubmodelById(technical.id)).isSuccess);

        // Inner AAS submodel references are handled on top level
    });

    it('No submodels are selected for copying', async function () {
        const service = TransferService.createNull({
            targetAasRepository: ServiceReachable.Yes,
            sourceAasRepository: ServiceReachable.Yes,
            targetSubmodelRepository: ServiceReachable.Yes,
            sourceSubmodelRepository: ServiceReachable.Yes,
            targetAasDiscovery: ServiceReachable.Yes,
            targetAasRegistry: ServiceReachable.Yes,
            targetSubmodelRegistry: ServiceReachable.Yes,
            sourceAasEntries: [aas],
            sourceSubmodelEntries: [nameplate, technical],
        });

        await service.transferAasWithSubmodels(transferAas, [], 0);

        // aas submodel properties should be null
        const targetSubmodelRepo = service.targetSubmodelRepositoryClient;
        expect(!(await targetSubmodelRepo.getSubmodelById(nameplate.id)).isSuccess);
        expect(!(await targetSubmodelRepo.getSubmodelById(technical.id)).isSuccess);

        // Inner AAS submodel references are handled on top level
    });

    it('The target aas already exists in repo', async function () {
        const service = TransferService.createNull({
            targetAasRepository: ServiceReachable.Yes,
            sourceAasRepository: ServiceReachable.Yes,
            targetSubmodelRepository: ServiceReachable.Yes,
            sourceSubmodelRepository: ServiceReachable.Yes,
            targetAasDiscovery: ServiceReachable.Yes,
            targetAasRegistry: ServiceReachable.Yes,
            targetSubmodelRegistry: ServiceReachable.Yes,
            sourceAasEntries: [aas],
            sourceSubmodelEntries: [nameplate, technical],
        });

        await service.targetAasRepositoryClient.postAssetAdministrationShell(aas);
        const transferResult = await service.transferAasWithSubmodels(
            transferAas,
            [transferNameplate, transferTechnical],
            0,
        );

        // error for repository, rest ok
        expectTransferResult(transferResult, 0b0111111);
    });

    it('The target aas already exists in registry', async function () {
        const service = TransferService.createNull({
            targetAasRepository: ServiceReachable.Yes,
            sourceAasRepository: ServiceReachable.Yes,
            targetSubmodelRepository: ServiceReachable.Yes,
            sourceSubmodelRepository: ServiceReachable.Yes,
            targetAasDiscovery: ServiceReachable.Yes,
            targetAasRegistry: ServiceReachable.Yes,
            targetSubmodelRegistry: ServiceReachable.Yes,
            sourceAasEntries: [aas],
            sourceSubmodelEntries: [nameplate, technical],
        });

        const shellDescriptor = createShellDescriptorFromAas(aas, service.targetSubmodelRepositoryClient?.getBaseUrl());
        await service.targetAasRegistryClient!.postAssetAdministrationShellDescriptor(shellDescriptor);
        const transferResult = await service.transferAasWithSubmodels(
            transferAas,
            [transferNameplate, transferTechnical],
            0,
        );

        // error for aas registry only
        expectTransferResult(transferResult, 0b1101111);
    });

    it('The target aas already exists in discovery', async function () {
        const service = TransferService.createNull({
            targetAasRepository: ServiceReachable.Yes,
            sourceAasRepository: ServiceReachable.Yes,
            targetSubmodelRepository: ServiceReachable.Yes,
            sourceSubmodelRepository: ServiceReachable.Yes,
            targetAasDiscovery: ServiceReachable.Yes,
            targetAasRegistry: ServiceReachable.Yes,
            targetSubmodelRegistry: ServiceReachable.Yes,
            sourceAasEntries: [aas],
            sourceSubmodelEntries: [nameplate, technical],
        });

        await service.targetAasDiscoveryClient!.linkAasIdAndAssetId(aas.id, aas.assetInformation.globalAssetId!);
        const transferResult = await service.transferAasWithSubmodels(
            transferAas,
            [transferNameplate, transferTechnical],
            0,
        );

        // error for discovery only
        expectTransferResult(transferResult, 0b1011111);
    });

    it('The target submodel already exists in repo', async function () {
        const service = TransferService.createNull({
            targetAasRepository: ServiceReachable.Yes,
            sourceAasRepository: ServiceReachable.Yes,
            targetSubmodelRepository: ServiceReachable.Yes,
            sourceSubmodelRepository: ServiceReachable.Yes,
            targetAasDiscovery: ServiceReachable.Yes,
            targetAasRegistry: ServiceReachable.Yes,
            targetSubmodelRegistry: ServiceReachable.Yes,
            sourceAasEntries: [aas],
            sourceSubmodelEntries: [nameplate, technical],
        });

        await service.targetSubmodelRepositoryClient.postSubmodel(nameplate);
        const transferResult = await service.transferAasWithSubmodels(
            transferAas,
            [transferNameplate, transferTechnical],
            0,
        );

        // error for repository of submodel, registry is ok
        expectTransferResult(transferResult, 0b1110111);
    });

    it('The target submodel already exists in registry', async function () {
        const service = TransferService.createNull({
            targetAasRepository: ServiceReachable.Yes,
            sourceAasRepository: ServiceReachable.Yes,
            targetSubmodelRepository: ServiceReachable.Yes,
            sourceSubmodelRepository: ServiceReachable.Yes,
            targetAasDiscovery: ServiceReachable.Yes,
            targetAasRegistry: ServiceReachable.Yes,
            targetSubmodelRegistry: ServiceReachable.Yes,
            sourceAasEntries: [aas],
            sourceSubmodelEntries: [nameplate, technical],
        });

        const submodelDescriptor = createSubmodelDescriptorFromSubmodel(
            nameplate,
            service.targetAasRepositoryClient.getBaseUrl(),
        );
        await service.targetSubmodelRegistryClient!.postSubmodelDescriptor(submodelDescriptor);
        const transferResult = await service.transferAasWithSubmodels(
            transferAas,
            [transferNameplate, transferTechnical],
            0,
        );

        // error for repository and registry of submodel
        expectTransferResult(transferResult, 0b1111101);
    });
});

describe('TransferService: egress guard', function () {
    beforeEach(() => {
        assertEgressAllowedMock.mockReset();
        assertEgressAllowedMock.mockResolvedValue(undefined);
    });

    it('blocks the transfer when the target AAS repository is not egress-allowed, and writes nothing', async () => {
        const blockedUrl = 'http://10.0.0.5/aas';
        assertEgressAllowedMock.mockImplementation((url: string) =>
            url === blockedUrl ? Promise.reject(new Error(`Egress blocked: "${url}" is an internal address.`)) : Promise.resolve(),
        );

        const service = TransferService.createNull({
            targetAasRepository: ServiceReachable.Yes,
            sourceAasRepository: ServiceReachable.Yes,
            targetSubmodelRepository: ServiceReachable.Yes,
            sourceSubmodelRepository: ServiceReachable.Yes,
            sourceAasEntries: [aas],
            sourceSubmodelEntries: [nameplate, technical],
            config: {
                targetAasRepo: { url: blockedUrl, infrastructureName: 'Default' },
            },
        });

        const transferResult = await service.transferAasWithSubmodels(
            transferAas,
            [transferNameplate, transferTechnical],
            0,
        );

        expect(transferResult).toHaveLength(1);
        expect(transferResult[0].success).toBe(false);
        expect(transferResult[0].resourceId).toBe(blockedUrl);

        expect((await service.targetAasRepositoryClient.getAssetAdministrationShellById(aas.id)).isSuccess).toBe(
            false,
        );
        expect((await service.targetSubmodelRepositoryClient.getSubmodelById(nameplate.id)).isSuccess).toBe(false);
    });

    it('blocks the transfer when the source AAS repository is not egress-allowed, and writes nothing', async () => {
        const blockedUrl = 'http://10.0.0.5/source-aas';
        assertEgressAllowedMock.mockImplementation((url: string) =>
            url === blockedUrl ? Promise.reject(new Error(`Egress blocked: "${url}" is an internal address.`)) : Promise.resolve(),
        );

        const service = TransferService.createNull({
            targetAasRepository: ServiceReachable.Yes,
            sourceAasRepository: ServiceReachable.Yes,
            targetSubmodelRepository: ServiceReachable.Yes,
            sourceSubmodelRepository: ServiceReachable.Yes,
            sourceAasEntries: [aas],
            sourceSubmodelEntries: [nameplate, technical],
            config: {
                sourceAasRepo: { url: blockedUrl, infrastructureName: 'Default' },
            },
        });

        const transferResult = await service.transferAasWithSubmodels(
            transferAas,
            [transferNameplate, transferTechnical],
            0,
        );

        expect(transferResult).toHaveLength(1);
        expect(transferResult[0].success).toBe(false);
        expect(transferResult[0].resourceId).toBe(blockedUrl);

        expect((await service.targetAasRepositoryClient.getAssetAdministrationShellById(aas.id)).isSuccess).toBe(
            false,
        );
        expect((await service.targetSubmodelRepositoryClient.getSubmodelById(nameplate.id)).isSuccess).toBe(false);
    });

    it('guards all 7 configured repository URLs before transferring', async () => {
        const config = {
            targetAasRepo: { url: 'https://target-aas.example', infrastructureName: 'Default' },
            sourceAasRepo: { url: 'https://source-aas.example', infrastructureName: 'Default' },
            targetSubmodelRepo: { url: 'https://target-submodel.example', infrastructureName: 'Default' },
            sourceSubmodelRepo: { url: 'https://source-submodel.example', infrastructureName: 'Default' },
            targetDiscovery: { url: 'https://target-discovery.example', infrastructureName: 'Default' },
            targetAasRegistry: { url: 'https://target-aas-registry.example', infrastructureName: 'Default' },
            targetSubmodelRegistry: { url: 'https://target-submodel-registry.example', infrastructureName: 'Default' },
        };

        const service = TransferService.createNull({
            targetAasRepository: ServiceReachable.Yes,
            sourceAasRepository: ServiceReachable.Yes,
            targetSubmodelRepository: ServiceReachable.Yes,
            sourceSubmodelRepository: ServiceReachable.Yes,
            targetAasDiscovery: ServiceReachable.Yes,
            targetAasRegistry: ServiceReachable.Yes,
            targetSubmodelRegistry: ServiceReachable.Yes,
            sourceAasEntries: [aas],
            sourceSubmodelEntries: [nameplate, technical],
            config,
        });

        await service.transferAasWithSubmodels(transferAas, [transferNameplate, transferTechnical], 0);

        expect(assertEgressAllowedMock).toHaveBeenCalledTimes(7);
        Object.values(config).forEach((repo) => {
            expect(assertEgressAllowedMock).toHaveBeenCalledWith(repo.url, repo.infrastructureName);
        });
    });

    it('does not guard optional repositories that are absent', async () => {
        const config = {
            targetAasRepo: { url: 'https://target-aas.example', infrastructureName: 'Default' },
            sourceAasRepo: { url: 'https://source-aas.example', infrastructureName: 'Default' },
            targetSubmodelRepo: { url: 'https://target-submodel.example', infrastructureName: 'Default' },
            sourceSubmodelRepo: { url: 'https://source-submodel.example', infrastructureName: 'Default' },
        };

        const service = TransferService.createNull({
            targetAasRepository: ServiceReachable.Yes,
            sourceAasRepository: ServiceReachable.Yes,
            targetSubmodelRepository: ServiceReachable.Yes,
            sourceSubmodelRepository: ServiceReachable.Yes,
            sourceAasEntries: [aas],
            sourceSubmodelEntries: [nameplate, technical],
            config,
        });

        await service.transferAasWithSubmodels(transferAas, [transferNameplate, transferTechnical], 0);

        // Only the 4 required repositories are present; no calls for discovery/registries.
        expect(assertEgressAllowedMock).toHaveBeenCalledTimes(4);
    });
});

describe('TransferService: create() credential gate', function () {
    const config: TransferServiceConfig = {
        targetAasRepo: { url: 'https://target-aas.example', infrastructureName: 'TargetInfra' },
        sourceAasRepo: { url: 'https://source-aas.example', infrastructureName: 'SourceInfra' },
        targetSubmodelRepo: { url: 'https://target-submodel.example', infrastructureName: 'TargetInfra' },
        sourceSubmodelRepo: { url: 'https://source-submodel.example', infrastructureName: 'SourceInfra' },
    };

    beforeEach(() => {
        jest.clearAllMocks();
        mnestixFetchMock.mockReturnValue({});
    });

    it('resolves headers per URL against the matching target/source infrastructure and passes each to mnestixFetch', async () => {
        const targetInfrastructure = createTestInfrastructure({ name: 'TargetInfra' });
        const sourceInfrastructure = createTestInfrastructure({ name: 'SourceInfra' });
        const targetHeader = { 'X-API-KEY': 'target-secret' };
        const sourceHeader = { 'X-API-KEY': 'source-secret' };

        getInfrastructureByNameMock.mockImplementation((name: string) =>
            Promise.resolve(name === 'TargetInfra' ? targetInfrastructure : sourceInfrastructure),
        );
        securityHeadersForUrlMock.mockImplementation((url: string) => {
            if (url === config.targetAasRepo.url || url === config.targetSubmodelRepo.url) {
                return Promise.resolve(targetHeader);
            }
            return Promise.resolve(sourceHeader);
        });

        await TransferService.create(config);

        // Target-side URLs resolve headers via the target infrastructure, source-side via the source infrastructure.
        expect(securityHeadersForUrlMock).toHaveBeenCalledWith(config.targetAasRepo.url, targetInfrastructure);
        expect(securityHeadersForUrlMock).toHaveBeenCalledWith(config.sourceAasRepo.url, sourceInfrastructure);
        expect(securityHeadersForUrlMock).toHaveBeenCalledWith(config.targetSubmodelRepo.url, targetInfrastructure);
        expect(securityHeadersForUrlMock).toHaveBeenCalledWith(config.sourceSubmodelRepo.url, sourceInfrastructure);

        // Each client's mnestixFetch call carries exactly the header resolved for its own URL, in creation order
        // (targetAasRepo, sourceAasRepo, targetSubmodelRepo, sourceSubmodelRepo).
        expect(mnestixFetchMock.mock.calls).toEqual([[targetHeader], [sourceHeader], [targetHeader], [sourceHeader]]);
    });

    it('passes null to mnestixFetch (no key leak) when the URL is not configured for its infrastructure', async () => {
        getInfrastructureByNameMock.mockResolvedValue(undefined);
        securityHeadersForUrlMock.mockResolvedValue(null);

        const attackerConfig: TransferServiceConfig = {
            targetAasRepo: { url: 'http://attacker.example/target-aas', infrastructureName: 'Default' },
            sourceAasRepo: { url: 'http://attacker.example/source-aas', infrastructureName: 'Default' },
            targetSubmodelRepo: { url: 'http://attacker.example/target-submodel', infrastructureName: 'Default' },
            sourceSubmodelRepo: { url: 'http://attacker.example/source-submodel', infrastructureName: 'Default' },
        };

        await TransferService.create(attackerConfig);

        expect(mnestixFetchMock).toHaveBeenCalledTimes(4);
        mnestixFetchMock.mock.calls.forEach((call) => {
            expect(call[0]).toBeNull();
        });
    });

    it('resolves headers for the optional repos (discovery, aas registry, submodel registry) against the target infrastructure and passes each to mnestixFetch', async () => {
        const targetInfrastructure = createTestInfrastructure({ name: 'TargetInfra' });
        const sourceInfrastructure = createTestInfrastructure({ name: 'SourceInfra' });
        const mandatoryHeader = { 'X-API-KEY': 'mandatory-secret' };
        const discoveryHeader = { 'X-API-KEY': 'discovery-secret' };
        const aasRegistryHeader = { 'X-API-KEY': 'aas-registry-secret' };
        const submodelRegistryHeader = { 'X-API-KEY': 'submodel-registry-secret' };

        const configWithOptionalRepos: TransferServiceConfig = {
            ...config,
            targetDiscovery: { url: 'https://target-discovery.example', infrastructureName: 'TargetInfra' },
            targetAasRegistry: { url: 'https://target-aas-registry.example', infrastructureName: 'TargetInfra' },
            targetSubmodelRegistry: {
                url: 'https://target-submodel-registry.example',
                infrastructureName: 'TargetInfra',
            },
        };

        getInfrastructureByNameMock.mockImplementation((name: string) =>
            Promise.resolve(name === 'TargetInfra' ? targetInfrastructure : sourceInfrastructure),
        );
        securityHeadersForUrlMock.mockImplementation((url: string) => {
            if (url === configWithOptionalRepos.targetDiscovery!.url) return Promise.resolve(discoveryHeader);
            if (url === configWithOptionalRepos.targetAasRegistry!.url) return Promise.resolve(aasRegistryHeader);
            if (url === configWithOptionalRepos.targetSubmodelRegistry!.url) {
                return Promise.resolve(submodelRegistryHeader);
            }
            return Promise.resolve(mandatoryHeader);
        });

        await TransferService.create(configWithOptionalRepos);

        expect(securityHeadersForUrlMock).toHaveBeenCalledWith(
            configWithOptionalRepos.targetDiscovery!.url,
            targetInfrastructure,
        );
        expect(securityHeadersForUrlMock).toHaveBeenCalledWith(
            configWithOptionalRepos.targetAasRegistry!.url,
            targetInfrastructure,
        );
        expect(securityHeadersForUrlMock).toHaveBeenCalledWith(
            configWithOptionalRepos.targetSubmodelRegistry!.url,
            targetInfrastructure,
        );

        // Creation order: targetAasRepo, sourceAasRepo, targetSubmodelRepo, sourceSubmodelRepo,
        // targetDiscovery, targetAasRegistry, targetSubmodelRegistry.
        expect(mnestixFetchMock.mock.calls).toEqual([
            [mandatoryHeader],
            [mandatoryHeader],
            [mandatoryHeader],
            [mandatoryHeader],
            [discoveryHeader],
            [aasRegistryHeader],
            [submodelRegistryHeader],
        ]);
    });

    it('does not resolve headers or build clients for optional repos that are absent from the config', async () => {
        getInfrastructureByNameMock.mockResolvedValue(createTestInfrastructure({ name: 'TargetInfra' }));
        securityHeadersForUrlMock.mockResolvedValue({});

        const service = await TransferService.create(config);

        // Only the 4 mandatory repos should trigger header resolution and client creation.
        expect(securityHeadersForUrlMock).toHaveBeenCalledTimes(4);
        expect(mnestixFetchMock).toHaveBeenCalledTimes(4);
        expect(service.targetAasDiscoveryClient).toBeUndefined();
        expect(service.targetAasRegistryClient).toBeUndefined();
        expect(service.targetSubmodelRegistryClient).toBeUndefined();
    });
});
