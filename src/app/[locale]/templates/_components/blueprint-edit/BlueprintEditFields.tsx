import { Box, Typography } from '@mui/material';
import { LockedTextField } from 'components/basics/LockedTextField';
import { useEffect } from 'react';
import { SubmodelViewObject } from 'lib/types/SubmodelViewObject';
import { PropertyEditComponent } from './edit-components/property/PropertyEditComponent';
import debounce from 'lodash/debounce';
import {
    ModelFile,
    SubmodelElementChoice,
    KeyTypes,
    MultiLanguageProperty,
    Property,
    Submodel,
} from 'lib/api/aas/models';
import { MappingInfoEditComponent } from './edit-components/mapping-info/MappingInfoEditComponent';
import { MultiplicityEditComponent } from './edit-components/multiplicity/MultiplicityEditComponent';
import { MultiLangEditComponent } from './edit-components/multi-lang/MultiLangEditComponent';
import { SubmodelEditComponent } from './edit-components/SubmodelEditComponent';
import { FileEditComponent } from './edit-components/file/FileEditComponent';
import { useTranslations } from 'next-intl';
import { CollectionMappingInfoEditComponent } from '../template-edit/edit-components/collection-mapping-info/CollectionMappingInfoEditComponent';

export type BlueprintEditFieldsProps = {
    blueprintPart?: SubmodelViewObject;
    onBlueprintPartChange?: (newBlueprintPart: SubmodelViewObject) => void;
    updateBlueprintPart?: (
        newBlueprintPart: SubmodelViewObject,
        newOnBlueprintPartChange: (newBlueprintPart: SubmodelViewObject) => void,
    ) => void;
    isBasedOnCustomTemplate?: boolean | undefined;
};

export function BlueprintEditFields(props: BlueprintEditFieldsProps) {
    const t = useTranslations('pages.templates');

    const debouncedOnTemplateDataChange = debounce((data: Submodel | SubmodelElementChoice) => {
        onTemplateDataChange(data);
    }, 500);
    // cleanup effect for debounce:
    useEffect(() => {
        return () => {
            debouncedOnTemplateDataChange.cancel();
        };
    }, [debouncedOnTemplateDataChange]);

    function onTemplateDataChange(data: Submodel | SubmodelElementChoice) {
        if (props.blueprintPart && props.onBlueprintPartChange) {
            props.onBlueprintPartChange({ ...props.blueprintPart, data });
        }
        // keep template part input up to date, when not triggered by tree selection change
        if (props.blueprintPart && props.updateBlueprintPart && props.onBlueprintPartChange) {
            props.updateBlueprintPart({ ...props.blueprintPart, data }, props.onBlueprintPartChange);
        }
    }

    function getRenderFields() {
        if (!props.blueprintPart?.data) {
            return;
        }

        switch (props.blueprintPart.data.modelType) {
            case KeyTypes.Submodel:
                return (
                    <SubmodelEditComponent
                        data={props.blueprintPart?.data as Submodel}
                        onChange={debouncedOnTemplateDataChange}
                    />
                );
            case KeyTypes.Property:
                return (
                    <PropertyEditComponent
                        data={props.blueprintPart?.data as Property}
                        onChange={debouncedOnTemplateDataChange}
                    />
                );
            case KeyTypes.MultiLanguageProperty:
                return (
                    <MultiLangEditComponent
                        data={props.blueprintPart?.data as MultiLanguageProperty}
                        onChange={debouncedOnTemplateDataChange}
                    />
                );
            case KeyTypes.File:
                return (
                    <FileEditComponent
                        data={props.blueprintPart?.data as ModelFile}
                        onChange={debouncedOnTemplateDataChange}
                    />
                );
            case KeyTypes.SubmodelElementCollection:
                return <></>;
            case KeyTypes.SubmodelElementList:
                return <></>;

            default:
                return (
                    <Typography color="error" variant="body2" sx={{ mt: 2 }}>
                        {t('errors.unknownModelType', { type: `${props.blueprintPart.data.modelType}` })}
                    </Typography>
                );
        }
    }

    return (
        <Box key={props.blueprintPart?.id}>
            <LockedTextField
                label="idShort"
                key={props.blueprintPart?.data?.idShort}
                defaultValue={props.blueprintPart?.data?.idShort}
                fullWidth
            />

            {getRenderFields()}

            {props.blueprintPart?.data && (
                <>
                    <CollectionMappingInfoEditComponent
                        data={props.blueprintPart.data}
                        onChange={debouncedOnTemplateDataChange}
                        key={'collection-mapping-info-' + props.blueprintPart.data.idShort}
                    />
                    <MappingInfoEditComponent
                        data={props.blueprintPart.data}
                        onChange={debouncedOnTemplateDataChange}
                        key={'mapping-info-' + props.blueprintPart.data.idShort}
                    />
                    <MultiplicityEditComponent
                        data={props.blueprintPart.data}
                        onChange={debouncedOnTemplateDataChange}
                        key={'multiplicity-type' + props.blueprintPart.data.idShort}
                        allowMultiplicityToBeSet={
                            !!props.isBasedOnCustomTemplate && !props.blueprintPart.isAboutToBeDeleted
                        }
                    />
                </>
            )}
        </Box>
    );
}
