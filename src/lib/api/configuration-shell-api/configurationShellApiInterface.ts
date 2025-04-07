import { Submodel } from '@aas-core-works/aas-core3.0-typescript/dist/types/types';
import { ApiResponseWrapper } from 'lib/util/apiResponseWrapper/apiResponseWrapper';

export interface IConfigurationShellApi {
    getIdGenerationSettings(): Promise<ApiResponseWrapper<Submodel>>;

    putSingleIdGenerationSetting(
        idShort: string,
        values: {
            prefix: string;
            dynamicPart: string;
        },
    ): Promise<void>;

    putSingleSettingValue(path: string, value: string, settingsType: string): Promise<ApiResponseWrapper<Response>>;
}
