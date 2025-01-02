'use server';

import { mnestixFetchLegacy } from 'lib/api/infrastructure';
import { AasListClient, AasListEntry } from 'lib/api/generated-api/clients.g';
import { ListService } from 'lib/services/list-service/ListService';

const aasListApi = AasListClient.create(process.env.MNESTIX_BACKEND_API_URL, mnestixFetchLegacy());

export async function getAasListEntries(): Promise<AasListEntry[]> {
    return aasListApi.getAasListEntries();
}

export async function getAasListEntities(targetRepository: string, limit: number, cursor?: string) {
    const listService = ListService.create(targetRepository);
    return listService.getAasListEntities(limit, cursor);
}

export async function getNameplateValuesForAAS(targetRepository: string, aasId: string) {
    const listService = ListService.create(targetRepository);
    return listService.getNameplateValuesForAAS(aasId);
}