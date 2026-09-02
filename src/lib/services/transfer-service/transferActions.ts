'use server';

import { TransferService } from 'lib/services/transfer-service/TransferService';
import { TransferDto, TransferResult } from 'lib/types/TransferServiceData';
import { requireAdmin } from 'lib/util/securityHelpers/authGuard';

export async function transferAasWithSubmodels(transferDto: TransferDto): Promise<TransferResult[]> {
    await requireAdmin();

    const transfer = await TransferService.create({
        targetAasRepo: transferDto.targetAasRepository,
        sourceAasRepo: transferDto.sourceAasRepository,
        targetSubmodelRepo: transferDto.targetSubmodelRepository,
        sourceSubmodelRepo: transferDto.sourceSubmodelRepository,
        targetDiscovery: transferDto.targetDiscovery,
        targetAasRegistry: transferDto.targetAasRegistry,
        targetSubmodelRegistry: transferDto.targetSubmodelRegistry,
    });
    return transfer.transferAasWithSubmodels(transferDto.aas, transferDto.submodels);
}
