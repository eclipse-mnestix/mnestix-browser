import { Submodel } from '@aas-core-works/aas-core3.0-typescript/types';
import { IConfigurationShellApi } from 'lib/api/configuration-shell-api/configurationShellApiInterface';
import { ApiResponseWrapper, wrapErrorCode, wrapSuccess } from 'lib/util/apiResponseWrapper/apiResponseWrapper';
import { ApiResultStatus } from 'lib/util/apiResponseWrapper/apiResultStatus';

export class ConfigurationShellApi implements IConfigurationShellApi {
    private constructor(
        protected baseUrl: string,
        protected use_authentication: boolean,
        protected http: {
            fetch<T>(url: RequestInfo, init?: RequestInit): Promise<ApiResponseWrapper<T>>;
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
        let url = this.baseUrl + '/api/configuration';
        url = url.replace(/[?&]$/, '');

        const options: RequestInit = {
            method: 'GET',
            headers: {},
        };

        const response = await this.http.fetch<Submodel>(url, options);

        return response;
    }

    async putSingleIdGenerationSetting(
        idShort: string,
        values: {
            prefix: string;
            dynamicPart: string;
        },
    ): Promise<ApiResponseWrapper<void>> {
        // DANGER DANGER
        // THIS IS JUST A TEMPORARY FIX TILL BASYX FIXES THE PATCH CALL TO NOT GIVE 404 WHEN THERE IS NO CHANGE
        // BUG IS IN BASYX 2.0.0-milestone5
        // DANGER DANGER
        let response = await this.putSingleSettingValue(`${idShort}.Prefix`, values.prefix);
        if (!response.isSuccess && response.errorCode != ApiResultStatus.NOT_FOUND) {
            return wrapErrorCode(response.errorCode, response.message);
        }
        response = await this.putSingleSettingValue(`${idShort}.DynamicPart`, values.dynamicPart);
        if (!response.isSuccess && response.errorCode != ApiResultStatus.NOT_FOUND) {
            return wrapErrorCode(response.errorCode, response.message);
        }

        return wrapSuccess(response.result);
    }

    async putSingleSettingValue(path: string, value: string): Promise<ApiResponseWrapper<void>> {
        let url = `${this.baseUrl}/api/configuration?idShortPath=${path}&value=${value}`;
        url = url.replace(/[?&]$/, '');

        const options: RequestInit = {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
            },
        };

        const response = await this.http.fetch<void>(url, options);

        return response;
    }
}
