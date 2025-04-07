import { Submodel } from '@aas-core-works/aas-core3.0-typescript/types';
import { IConfigurationShellApi } from 'lib/api/configuration-shell-api/configurationShellApiInterface';
import { ApiResponseWrapper, wrapErrorCode, wrapSuccess } from 'lib/util/apiResponseWrapper/apiResponseWrapper';

export class ConfigurationShellApi implements IConfigurationShellApi {
    private constructor(
        protected baseUrl: string,
        protected use_authentication: boolean,
        protected http: { 
            fetch<T>(url: RequestInfo, init?: RequestInit): Promise<ApiResponseWrapper<T>> 
        },
    ) {}

    static create(
        baseUrl: string | undefined,
        use_authentication: boolean,
        http: {
            fetch<T>(url: RequestInfo, init?: RequestInit): Promise<ApiResponseWrapper<T>>;
        },
    ): ConfigurationShellApi {
        if (!baseUrl) {
            throw new Error('Base URL is required');
        }
        return new ConfigurationShellApi(baseUrl, use_authentication, http);
    }

    async getIdGenerationSettings(): Promise<ApiResponseWrapper<Submodel>> {
        let url = this.baseUrl + '/configuration/idGeneration';
        url = url.replace(/[?&]$/, '');

        const options: RequestInit = {
            method: 'GET',
            headers: {},
        };

        const response = await this.http.fetch<Submodel>(url, options);

        if (!response.isSuccess) { return wrapErrorCode(response.errorCode, response.message); }

        return wrapSuccess(response.result);
    }

    async putSingleIdGenerationSetting(
        idShort: string,
        values: {
            prefix: string;
            dynamicPart: string;
        },
    ) {
        await this.putSingleSettingValue(`${idShort}.Prefix`, values.prefix, 'idGeneration');
        await this.putSingleSettingValue(`${idShort}.DynamicPart`, values.dynamicPart, 'idGeneration');
    }

    async putSingleSettingValue(path: string, value: string, settingsType: string): Promise<ApiResponseWrapper<Response>> {
        let url = `${this.baseUrl}/configuration/${settingsType}/submodel-elements/${path}/$value`;
        url = url.replace(/[?&]$/, '');

        const content = JSON.stringify(value);

        const options: RequestInit = {
            body: content,
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
            },
        };

        const response = await this.http.fetch<Response>(url, options);

        if (!response.isSuccess) { return wrapErrorCode(response.errorCode, response.message); }

        return wrapSuccess(response.result);
    }
}
