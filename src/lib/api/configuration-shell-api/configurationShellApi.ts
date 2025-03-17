import { Submodel } from '@aas-core-works/aas-core3.0-typescript/types';
import { IConfigurationShellApi } from 'lib/api/configuration-shell-api/configurationShellApiInterface';

export class ConfigurationShellApi implements IConfigurationShellApi {
    private http: { fetch(url: RequestInfo, init?: RequestInit): Promise<Response> };
    basePath: string;
    use_authentication: boolean;

    private constructor(
        protected _basePath: string = '',
        use_authentication: boolean,
        http?: { fetch(url: RequestInfo, init?: RequestInit): Promise<Response> },
    ) {
        this.http = http ? http : window;
        this.basePath = _basePath;
        this.use_authentication = use_authentication;
    }

    static create(
        _baseUrl: string = '',
        use_authentication: boolean,
        http?: {
            fetch(url: RequestInfo, init?: RequestInit): Promise<Response>;
        },
    ): ConfigurationShellApi {
        return new ConfigurationShellApi(_baseUrl, use_authentication, http ?? window);
    }

    async getIdGenerationSettings(): Promise<Submodel> {
        let url_ = this.basePath + '/configuration/idGeneration';
        url_ = url_.replace(/[?&]$/, '');

        const options_: RequestInit = {
            method: 'GET',
            headers: {},
        };

        return this.http.fetch(url_, options_).then((_response: Response) => {
            return this.processGetIdGenerationSettings(_response);
        });
    }

    async processGetIdGenerationSettings(response: Response): Promise<Submodel> {
        const status = response.status;
        const _headers: Record<string, string> = {};
        if (response.headers && response.headers.forEach) {
            response.headers.forEach((v, k) => (_headers[k] = v));
        }
        if (status === 200) {
            return response.json();
        } else if (status === 400) {
            const _responseText1 = await response.text();
            return _responseText1 === '' ? Promise.resolve<Submodel>(null as never) : JSON.parse(_responseText1);
        } else if (status !== 200 && status !== 204) {
            const _responseText2 = await response.text();
            return _responseText2 === '' ? Promise.resolve<Submodel>(null as never) : JSON.parse(_responseText2);
        }
        return Promise.resolve<Submodel>(null as never);
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

    async putSingleSettingValue(path: string, value: string, settingsType: string): Promise<Response> {
        let url_ = `${this.basePath}/configuration/${settingsType}/submodel-elements/${path}/$value`;
        url_ = url_.replace(/[?&]$/, '');

        const content_ = JSON.stringify(value);

        const options_: RequestInit = {
            body: content_,
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
            },
        };

        return this.http.fetch(url_, options_).then((_response: Response) => {
            return this.processPutSingleSettingValue(_response);
        });
    }

    async processPutSingleSettingValue(response: Response): Promise<Response> {
        const status = response.status;
        const _headers: Record<string, string> = {};
        if (response.headers && response.headers.forEach) {
            response.headers.forEach((v, k) => (_headers[k] = v));
        }
        if (status >= 200 && status < 300) {
            return response;
        } else {
            throw response;
        }
    }
}
