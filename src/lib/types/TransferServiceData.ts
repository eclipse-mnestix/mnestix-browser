import { AssetAdministrationShell, Submodel } from 'lib/api/aas/models';
import { RepositoryWithInfrastructure } from 'lib/services/database/InfrastructureMappedTypes';

export type TransferDto = {
    aas: TransferAas;
    submodels: TransferSubmodel[];
    targetAasRepository: RepositoryWithInfrastructure;
    sourceAasRepository: RepositoryWithInfrastructure;
    targetSubmodelRepository: RepositoryWithInfrastructure;
    sourceSubmodelRepository: RepositoryWithInfrastructure;
    targetDiscovery?: RepositoryWithInfrastructure;
    targetAasRegistry?: RepositoryWithInfrastructure;
    targetSubmodelRegistry?: RepositoryWithInfrastructure;
};

export type TransferSubmodel = {
    originalSubmodelId: string;
    submodel: Submodel;
};

export type TransferAas = {
    originalAasId: string;
    aas: AssetAdministrationShell;
};

export type TransferResult = {
    operationKind:
        | 'AasRepository'
        | 'Discovery'
        | 'AasRegistry'
        | 'SubmodelRepository'
        | 'SubmodelRegistry'
        | 'FileTransfer';
    success: boolean;
    resourceId: string;
    error: string;
};

export type AttachmentDetails = {
    idShortPath: string;
    fileName: string | null;
    file?: Blob;
};

export type TransferServiceConfig = {
    targetAasRepo: RepositoryWithInfrastructure;
    sourceAasRepo: RepositoryWithInfrastructure;
    targetSubmodelRepo: RepositoryWithInfrastructure;
    sourceSubmodelRepo: RepositoryWithInfrastructure;
    targetDiscovery?: RepositoryWithInfrastructure;
    targetAasRegistry?: RepositoryWithInfrastructure;
    targetSubmodelRegistry?: RepositoryWithInfrastructure;
};
