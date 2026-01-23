import { AssetAdministrationShellDescriptor } from 'lib/types/registryServiceTypes';
import { AssetAdministrationShell } from 'lib/api/aas/models';
import { ApiResponseWrapper } from 'lib/util/apiResponseWrapper/apiResponseWrapper';
import { PaginationData } from 'lib/api/basyx-v3/types';

export interface IRegistryServiceApi {
    /**
     * Returns the base URL of this AAS registry endpoint.
     */
    getBaseUrl(): string;

    getAllAssetAdministrationShellDescriptors(
        limit?: number,
        cursor?: string,
        options?: object,
    ): Promise<ApiResponseWrapper<PaginationData<AssetAdministrationShellDescriptor[]>>>;

    getAssetAdministrationShellDescriptorById(
        aasId: string,
    ): Promise<ApiResponseWrapper<AssetAdministrationShellDescriptor>>;

    putAssetAdministrationShellDescriptorById(
        aasId: string,
        shellDescriptor: AssetAdministrationShellDescriptor,
    ): Promise<ApiResponseWrapper<AssetAdministrationShellDescriptor>>;

    getAssetAdministrationShellFromEndpoint(endpoint: URL): Promise<ApiResponseWrapper<AssetAdministrationShell>>;

    postAssetAdministrationShellDescriptor(
        shellDescriptor: AssetAdministrationShellDescriptor,
    ): Promise<ApiResponseWrapper<void>>;
}
