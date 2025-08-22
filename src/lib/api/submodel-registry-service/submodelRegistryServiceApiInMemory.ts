import { ISubmodelRegistryServiceApi } from 'lib/api/submodel-registry-service/submodelRegistryServiceApiInterface';
import { SubmodelDescriptor } from 'lib/types/registryServiceTypes';
import ServiceReachable, { createTestSubmodel } from 'test-utils/TestUtils';
import { ApiResponseWrapper, wrapErrorCode, wrapSuccess } from 'lib/util/apiResponseWrapper/apiResponseWrapper';
import { ApiResultStatus } from 'lib/util/apiResponseWrapper/apiResultStatus';
import { Submodel } from 'lib/api/aas/models';

export class SubmodelRegistryServiceApiInMemory implements ISubmodelRegistryServiceApi {
    readonly registrySubmodelDescriptors: Map<string, SubmodelDescriptor>;

    constructor(
        readonly baseUrl: string,
        registrySubmodelDescriptors: SubmodelDescriptor[],
        readonly reachable: ServiceReachable,
    ) {
        this.registrySubmodelDescriptors = new Map<string, SubmodelDescriptor>();
        registrySubmodelDescriptors.forEach((submodelDescriptor) => {
            this.registrySubmodelDescriptors.set(submodelDescriptor.id, submodelDescriptor);
        });
    }

    getBasePath(): string {
        return this.baseUrl;
    }

    async getSubmodelDescriptorById(submodelId: string): Promise<ApiResponseWrapper<SubmodelDescriptor>> {
        if (this.reachable !== ServiceReachable.Yes)
            return wrapErrorCode(ApiResultStatus.UNKNOWN_ERROR, 'Service not reachable');
        const foundDescriptor = this.registrySubmodelDescriptors.get(submodelId);
        if (foundDescriptor) return wrapSuccess(foundDescriptor);
        return wrapErrorCode(
            ApiResultStatus.NOT_FOUND,
            `No Submodel descriptor for submodel id '${submodelId}' found in '${this.getBasePath()}'`,
        );
    }

    async putSubmodelDescriptorById(
        submodelDescriptor: SubmodelDescriptor,
    ): Promise<ApiResponseWrapper<SubmodelDescriptor>> {
        if (this.reachable !== ServiceReachable.Yes)
            return wrapErrorCode(ApiResultStatus.UNKNOWN_ERROR, 'Service not reachable');
        this.registrySubmodelDescriptors.set(submodelDescriptor.id, submodelDescriptor);
        return wrapSuccess(submodelDescriptor);
    }

    async deleteSubmodelDescriptorById(submodelId: string): Promise<ApiResponseWrapper<void>> {
        if (this.reachable !== ServiceReachable.Yes)
            return wrapErrorCode(ApiResultStatus.UNKNOWN_ERROR, 'Service not reachable');
        this.registrySubmodelDescriptors.delete(submodelId);
        return wrapSuccess(undefined);
    }

    async getAllSubmodelDescriptors(): Promise<ApiResponseWrapper<SubmodelDescriptor[]>> {
        if (this.reachable !== ServiceReachable.Yes)
            return wrapErrorCode(ApiResultStatus.UNKNOWN_ERROR, 'Service not reachable');
        return wrapSuccess([...this.registrySubmodelDescriptors.values()]);
    }

    async postSubmodelDescriptor(
        submodelDescriptor: SubmodelDescriptor,
    ): Promise<ApiResponseWrapper<SubmodelDescriptor>> {
        if (this.reachable !== ServiceReachable.Yes)
            return wrapErrorCode(ApiResultStatus.UNKNOWN_ERROR, 'Service not reachable');
        if (this.registrySubmodelDescriptors.has(submodelDescriptor.id))
            return wrapErrorCode(
                ApiResultStatus.UNKNOWN_ERROR,
                `Submodel registry '${this.getBasePath()}' already has a submodel descriptor for '${submodelDescriptor.id}'`,
            );
        this.registrySubmodelDescriptors.set(submodelDescriptor.id, submodelDescriptor);
        return wrapSuccess(submodelDescriptor);
    }

    async deleteAllSubmodelDescriptors(): Promise<ApiResponseWrapper<void>> {
        if (this.reachable !== ServiceReachable.Yes)
            return wrapErrorCode(ApiResultStatus.UNKNOWN_ERROR, 'Service not reachable');
        this.registrySubmodelDescriptors.clear();
        return wrapSuccess(undefined);
    }

    async getSubmodelFromEndpoint(endpoint: string): Promise<ApiResponseWrapper<Submodel>> {
        if (this.reachable !== ServiceReachable.Yes)
            return wrapErrorCode(ApiResultStatus.UNKNOWN_ERROR, 'Service not reachable');
        const submodelDescriptor = this.registrySubmodelDescriptors
            .values()
            .find((descriptor) =>
                descriptor.endpoints.find((smEndpoint) => smEndpoint.protocolInformation.href === endpoint),
            );
        if (!submodelDescriptor) {
            return wrapErrorCode(
                ApiResultStatus.NOT_FOUND,
                `No Submodel found at endpoint '${endpoint}' in registry '${this.getBasePath()}'`,
            );
        }
        const response = new Response(JSON.stringify(createTestSubmodel(submodelDescriptor.id)), {
            status: 200,
            headers: { 'Content-Type': 'application/json' },
        });
        const submodel: Submodel = await response.json();
        if (!submodel) {
            return wrapErrorCode(ApiResultStatus.NOT_FOUND, `Submodel not found at endpoint '${endpoint}'`);
        }
        return wrapSuccess(submodel);
    }
}
