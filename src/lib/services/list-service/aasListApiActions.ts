'use server';
import { headers } from 'next/headers';
import { ListService } from 'lib/services/list-service/ListService';
import { createRequestLogger } from 'lib/util/Logger';
import { RepositoryWithInfrastructure } from '../database/InfrastructureMappedTypes';

export async function getAasListEntities(
    targetRepository: RepositoryWithInfrastructure,
    limit: number,
    cursor?: string,
    type?: 'repository' | 'registry',
) {
    const logger = createRequestLogger(await headers());
    const listService = await ListService.create(targetRepository, logger);
    return listService.getAasListEntities(limit, cursor, type);
}

export async function getNameplateValuesForAAS(targetRepository: RepositoryWithInfrastructure, aasId: string) {
    const logger = createRequestLogger(await headers());
    const listService = await ListService.create(targetRepository, logger);
    return listService.getNameplateValuesForAAS(aasId);
}
