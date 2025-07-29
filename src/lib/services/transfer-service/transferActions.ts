'use server';

import { TransferService } from 'lib/services/transfer-service/TransferService';
import { TransferDto, TransferResult } from 'lib/types/TransferServiceData';

export async function transferAasWithSubmodels(transferDto: TransferDto): Promise<TransferResult[]> {
    const transfer = TransferService.create({
        targetAasRepoUrl: transferDto.targetAasRepositoryBaseUrl,
        sourceAasRepoUrl: transferDto.sourceAasRepositoryBaseUrl,
        targetSubmodelRepoUrl: transferDto.targetSubmodelRepositoryBaseUrl,
        sourceSubmodelRepoUrl: transferDto.sourceSubmodelRepositoryBaseUrl,
        targetDiscoveryUrl: transferDto.targetDiscoveryBaseUrl,
        targetAasRegistryUrl: transferDto.targetAasRegistryBaseUrl,
        targetSubmodelRegistryUrl: transferDto.targetSubmodelRegistryBaseUrl,
        apikey: transferDto.apikey,
    });
    return transfer.transferAasWithSubmodels(transferDto.aas, transferDto.submodels);
}
