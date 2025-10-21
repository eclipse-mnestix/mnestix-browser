import { Submodel } from 'lib/api/aas/models';
import { ApiResponseWrapper } from 'lib/util/apiResponseWrapper/apiResponseWrapper';

/**
 * @deprecated use generated aas-generator client instead!
 */
export interface IConfigurationShellApi {
    getIdGenerationSettings(): Promise<ApiResponseWrapper<Submodel>>;

    putSingleIdGenerationSetting(
        idShort: string,
        values: {
            prefix: string;
            dynamicPart: string;
        },
    ): Promise<ApiResponseWrapper<void>>;

    putSingleSettingValue(path: string, value: string, settingsType: string): Promise<ApiResponseWrapper<void>>;
}
