import { Submodel } from '@aas-core-works/aas-core3.0-typescript/dist/types/types';

export interface IConfigurationShellApi {
    getIdGenerationSettings(): Promise<Submodel>;

    processGetIdGenerationSettings(response: Response): Promise<Submodel>;

    putSingleIdGenerationSetting(
        idShort: string,
        values: {
            prefix: string;
            dynamicPart: string;
        },
    ): Promise<void>;

    putSingleSettingValue(path: string, value: string, settingsType: string): Promise<Response>;

    processPutSingleSettingValue(response: Response): Promise<Response>;
}
