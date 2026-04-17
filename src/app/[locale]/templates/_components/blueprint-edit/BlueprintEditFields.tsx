import { Box, Typography } from '@mui/material';
import { useBlueprintContext } from 'app/[locale]/templates/_components/blueprint-edit/BlueprintContext';
import { LockedTextField } from 'components/basics/LockedTextField';
import {
    KeyTypes,
    ModelFile,
    MultiLanguageProperty,
    Property,
    Submodel,
    SubmodelElementChoice,
} from 'lib/api/aas/models';
import { useTranslations } from 'next-intl';
import { FileEditComponent } from './edit-components/file/FileEditComponent';
import { MappingInfoEditComponent } from './edit-components/mapping-info/MappingInfoEditComponent';
import { MultiLangEditComponent } from './edit-components/multi-lang/MultiLangEditComponent';
import { MultiplicityEditComponent } from './edit-components/multiplicity/MultiplicityEditComponent';
import { PropertyEditComponent } from './edit-components/property/PropertyEditComponent';
import { SubmodelEditComponent } from './edit-components/SubmodelEditComponent';
import { MappingInfoData } from 'lib/types/MappingInfoData';
import mappingInfoDataJson from './edit-components/mapping-info/mapping-info-data.json';
import collectionMappingInfoDataJson from './edit-components/mapping-info/collection-mapping-info-data.json';
import filterMappingInfoDataJson from './edit-components/mapping-info/filter-mapping-info.json';

export function BlueprintEditFields() {
    const { selectedElement, updateSelectedElement, isBasedOnCustomTemplate } = useBlueprintContext();
    const t = useTranslations('pages.templates');

    function onTemplateDataChange(data: Submodel | SubmodelElementChoice) {
        if (selectedElement) {
            updateSelectedElement({ ...selectedElement, data });
        }
    }

    function getRenderFields() {
        if (!selectedElement?.data) {
            return;
        }

        switch (selectedElement.data.modelType) {
            case KeyTypes.Submodel:
                return (
                    <SubmodelEditComponent data={selectedElement.data as Submodel} onChange={onTemplateDataChange} />
                );
            case KeyTypes.Property:
                return (
                    <PropertyEditComponent data={selectedElement.data as Property} onChange={onTemplateDataChange} />
                );
            case KeyTypes.MultiLanguageProperty:
                return (
                    <MultiLangEditComponent
                        data={selectedElement.data as MultiLanguageProperty}
                        onChange={onTemplateDataChange}
                    />
                );
            case KeyTypes.File:
                return <FileEditComponent data={selectedElement.data as ModelFile} onChange={onTemplateDataChange} />;
            case KeyTypes.SubmodelElementCollection:
                return <></>;
            case KeyTypes.SubmodelElementList:
                return <></>;

            default:
                return (
                    <Typography color="error" variant="body2" sx={{ mt: 2 }}>
                        {t('errors.unknownModelType', { type: `${selectedElement.data.modelType}` })}
                    </Typography>
                );
        }
    }

    return (
        <Box key={selectedElement?.id}>
            <LockedTextField
                label="idShort"
                key={selectedElement?.data?.idShort}
                defaultValue={selectedElement?.data?.idShort}
                fullWidth
            />
            {selectedElement?.data?.modelType && (
                <Box display="flex" alignItems="center" justifyContent="space-between" mt="16px">
                    <Typography variant="body2" color="text.secondary">
                        {t('labels.modelType')}
                    </Typography>
                    <Box display="flex" alignItems="center">
                        <Typography variant="subtitle2" sx={{ ml: 2 }}>
                            {selectedElement.data.modelType}
                        </Typography>
                    </Box>
                </Box>
            )}
            {/* Render the SME-Fields */}
            {getRenderFields()}

            {/* Render the Mapping-Qualifiers */}
            {selectedElement?.data && (
                <>
                    <MappingInfoEditComponent
                        data={selectedElement.data}
                        onChange={onTemplateDataChange}
                        mappingInfoData={collectionMappingInfoDataJson as MappingInfoData}
                        headingType="collectionMappingInfo"
                        key={'collection-mapping-info-' + selectedElement.data.idShort}
                    />
                    <MappingInfoEditComponent
                        data={selectedElement.data}
                        onChange={onTemplateDataChange}
                        mappingInfoData={mappingInfoDataJson as MappingInfoData}
                        headingType="mappingInfo"
                        key={'mapping-info-' + selectedElement.data.idShort}
                    />
                    <MappingInfoEditComponent
                        data={selectedElement.data}
                        onChange={onTemplateDataChange}
                        mappingInfoData={filterMappingInfoDataJson as MappingInfoData}
                        headingType="filterMappingInfo"
                        key={'filter-mapping-info-' + selectedElement.data.idShort}
                    />
                    <MultiplicityEditComponent
                        data={selectedElement.data}
                        onChange={onTemplateDataChange}
                        key={'multiplicity-type' + selectedElement.data.idShort}
                        allowMultiplicityToBeSet={!!isBasedOnCustomTemplate}
                    />
                </>
            )}
        </Box>
    );
}
