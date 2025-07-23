import { expect } from '@jest/globals';
import { TransferService } from 'lib/services/transfer-service/TransferService';
import testData from './TransferService.data.json';
import { AssetAdministrationShell, Submodel } from 'lib/api/aas/models';
import {
    createShellDescriptorFromAas,
    createSubmodelDescriptorFromSubmodel,
} from 'lib/services/transfer-service/TransferUtil';
import { TransferAas, TransferResult, TransferSubmodel } from 'lib/types/TransferServiceData';
import ServiceReachable from 'test-utils/TestUtils';

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
