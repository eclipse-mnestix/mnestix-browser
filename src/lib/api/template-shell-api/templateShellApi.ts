import { encodeBase64 } from 'lib/util/Base64Util';
import { Submodel } from 'lib/api/aas/models';
import { MnestixFetch } from '../infrastructure';
import { ApiResponseWrapper } from 'lib/util/apiResponseWrapper/apiResponseWrapper';

/**
 * @deprecated use TemplateClient from generated-api instead!
 */
export class TemplateShellApi {
    basePathOwnApi: string;
    private http: MnestixFetch;

    constructor(backendApiUrl: string, http: MnestixFetch) {
        this.basePathOwnApi = `${backendApiUrl}/api/Template`;
        this.http = http;
    }

    static create(backendApiUrl: string, http: MnestixFetch): TemplateShellApi {
        return new TemplateShellApi(backendApiUrl, http);
    }

    public async getTemplates(): Promise<ApiResponseWrapper<Submodel[]>> {
        const response = await this.http.fetch<Submodel[]>(`${this.basePathOwnApi}/allDefaultSubmodels`, {
            method: 'GET',
            headers: {
                Accept: 'application/json',
            },
        });

        return response;
    }

    public async getBlueprints(): Promise<ApiResponseWrapper<Submodel[]>> {
        const response = await this.http.fetch<Submodel[]>(`${this.basePathOwnApi}/allCustomSubmodels`, {
            method: 'GET',
            headers: {
                Accept: 'application/json',
            },
        });

        return response;
    }

    public async getBlueprint(submodelIdShort: string): Promise<ApiResponseWrapper<Submodel>> {
        const response = await this.http.fetch<Submodel>(
            `${this.basePathOwnApi}/CustomSubmodel/${encodeBase64(submodelIdShort)}`,
            {
                method: 'GET',
                headers: {
                    Accept: 'application/json',
                },
            },
        );

        return response;
    }

    public async deleteBlueprintById(id: string): Promise<ApiResponseWrapper<string | number>> {
        // We use the regular delete endpoint, which expects an idShort, but because of our backend interception, we saved the actual id in the idShort field earlier.
        // That's why this works.
        const response = await this.http.fetch<string | number>(`${this.basePathOwnApi}/${encodeBase64(id)}`, {
            method: 'DELETE',
            headers: {
                Accept: 'application/json',
            },
        });

        return response;
    }
}
