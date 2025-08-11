'use server';

import { ListService } from 'lib/services/list-service/ListService';

export async function getAasListEntities(targetRepository: string, limit: number, cursor?: string) {
    const listService = ListService.create(targetRepository);
    return listService.getAasListEntities(limit, cursor);
}

export async function getNameplateValuesForAAS(targetRepository: string, aasId: string) {
    const listService = ListService.create(targetRepository);
    return listService.getNameplateValuesForAAS(aasId);
}
