import { encodeBase64 } from 'lib/util/Base64Util';
import { Submodel } from '@aas-core-works/aas-core3.0-typescript/types';

export class TemplateShellApi {
    basePathOwnApi: string;
    basePathCustoms: string;
    enable_authentication: boolean;
    private http: { fetch(url: RequestInfo, init?: RequestInit): Promise<Response> };

    constructor(
        backendApiUrl: string,
        enable_authentication: boolean,
        http?: { fetch(url: RequestInfo, init?: RequestInit): Promise<Response> },
    ) {
        this.basePathOwnApi = `${backendApiUrl}/api/Template`;
        this.basePathCustoms = `${backendApiUrl}/templates/custom`;
        this.enable_authentication = enable_authentication;
        this.http = http ? http : window;
    }

    static create(
        backendApiUrl: string,
        enable_authentication: boolean,
        http?: { fetch(url: RequestInfo, init?: RequestInit): Promise<Response> },
    ): TemplateShellApi {
        return new TemplateShellApi(backendApiUrl, enable_authentication, http);
    }

    public async getDefaults(): Promise<Submodel[]> {

        const response = await this.http.fetch(`${this.basePathOwnApi}/allDefaultSubmodels`, {
            method: 'GET',
            headers: {
                'Accept': 'application/json',
            },
        });

        if (response.status >= 200 && response.status < 300) {
            return response.json();
        } else {
            throw response;
        }
    }

    public async getCustoms(): Promise<Submodel[]> {

        const response = await this.http.fetch(`${this.basePathOwnApi}/allCustomSubmodels`, {
            method: 'GET',
            headers: {
                'Accept': 'application/json',
            },
        });

        if (response.status >= 200 && response.status < 300) {
            return response.json();
        } else {
            throw response;
        }
    }

    public async getCustom(submodelIdShort: string): Promise<Submodel> {

        const response = await this.http.fetch(
            `${this.basePathOwnApi}/CustomSubmodel/${encodeBase64(submodelIdShort)}`,
            {
                method: 'GET',
                headers: {
                    'Accept': 'application/json',
                },
            },
        );

        if (response.status >= 200 && response.status < 300) {
            return response.json();
        } else {
            throw response;
        }
    }

    public async deleteCustomById(id: string): Promise<string | number> {

        // We use the regular delete endpoint, which expects an idShort, but because of our backend interception, we saved the actual id in the idShort field earlier.
        // That's why this works.
        const response = await this.http.fetch(`${this.basePathCustoms}/${encodeBase64(id)}`, {
            method: 'DELETE',
            headers: {
                'Accept': 'application/json',
            },
        });

        if (response.status >= 200 && response.status < 300) {
            return response.status;
        } else {
            throw response;
        }
    }
}
