'use server';
import { headers } from 'next/headers';
import { ListService } from 'lib/services/list-service/ListService';
import { createRequestLogger } from 'lib/util/Logger';

export async function getAasListEntities(targetRepository: string, limit: number, cursor?: string) {
    const logger = createRequestLogger(await headers());
    const listService = await ListService.create(targetRepository, logger);
    return listService.getAasListEntities(limit, cursor);
}

export async function getNameplateValuesForAAS(targetRepository: string, aasId: string) {
    const logger = createRequestLogger(await headers());
    const listService = await ListService.create(targetRepository, logger);
    return listService.getNameplateValuesForAAS(aasId);
}
