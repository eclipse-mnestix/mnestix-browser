import { encodeBase64 } from 'lib/util/Base64Util';
import { Submodel } from 'lib/api/aas/models';
import { MnestixFetch } from '../infrastructure';
import { ApiResponseWrapper } from 'lib/util/apiResponseWrapper/apiResponseWrapper';
import { envs } from 'lib/env/MnestixEnv';

export class TemplateShellApi {
    basePathOwnApi: string;
    basePathCustoms: string;
    enable_authentication: boolean;
    private http: MnestixFetch;

    constructor(backendApiUrl: string, enable_authentication: boolean, http: MnestixFetch) {
        this.basePathOwnApi = `${backendApiUrl}/api/Template`;
        this.basePathCustoms = `${backendApiUrl}/templates/custom`;
        this.enable_authentication = enable_authentication;
        this.http = http;
    }

    static create(backendApiUrl: string, enable_authentication: boolean, http: MnestixFetch): TemplateShellApi {
        return new TemplateShellApi(backendApiUrl, enable_authentication, http);
    }

    public async getDefaults(): Promise<ApiResponseWrapper<Submodel[]>> {
        const response = await this.http.fetch<Submodel[]>(`${this.basePathOwnApi}/allDefaultSubmodels`, {
            method: 'GET',
            headers: {
                Accept: 'application/json',
            },
        });

        return response;
    }

    public async getCustoms(): Promise<ApiResponseWrapper<Submodel[]>> {
        const response = await this.http.fetch<Submodel[]>(`${this.basePathOwnApi}/allCustomSubmodels`, {
            method: 'GET',
            headers: {
                Accept: 'application/json',
            },
        });

        return response;
    }

    public async getCustom(submodelIdShort: string): Promise<ApiResponseWrapper<Submodel>> {
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

    public async deleteCustomById(id: string): Promise<ApiResponseWrapper<string | number>> {
        // We use the regular delete endpoint, which expects an idShort, but because of our backend interception, we saved the actual id in the idShort field earlier.
        // That's why this works.
        const isMnestixApiV2Enabled = envs.MNESTIX_V2_ENABLED;
        const basePath = isMnestixApiV2Enabled ? this.basePathOwnApi : this.basePathCustoms;
        const response = await this.http.fetch<string | number>(`${basePath}/${encodeBase64(id)}`, {
            method: 'DELETE',
            headers: {
                Accept: 'application/json',
            },
        });

        return response;
    }
}
