import { Box, Typography } from '@mui/material';
import { LockedTextField } from 'components/basics/LockedTextField';
import { useEffect, useState } from 'react';
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

export type BlueprintEditFieldsProps = {
    templatePart?: SubmodelViewObject;
    onTemplatePartChange?: (newTemplatePart: SubmodelViewObject) => void;
    updateTemplatePart?: (
        newTemplatePart: SubmodelViewObject,
        newOnTemplatePartChange: (newTemplatePart: SubmodelViewObject) => void,
    ) => void;
    isCustomTemplate?: boolean | undefined;
};

export function BlueprintEditFields(props: BlueprintEditFieldsProps) {
    const [templatePart, setTemplatePart] = useState(props.templatePart);
    const t = useTranslations('pages.templates');

    useEffect(() => {
        setTemplatePart(props.templatePart);
    }, [props.templatePart]);

    const debouncedOnTemplateDataChange = debounce((data: Submodel | SubmodelElementChoice) => {
        onTemplateDataChange(data);
    }, 500);
    // cleanup effect for debounce:
    useEffect(() => {
        debouncedOnTemplateDataChange.cancel();
    }, [debouncedOnTemplateDataChange]);

    function onTemplateDataChange(data: Submodel | SubmodelElementChoice) {
        if (templatePart && props.onTemplatePartChange) {
            props.onTemplatePartChange({ ...templatePart, data });
        }
        // keep template part input up to date, when not triggered by tree selection change
        if (templatePart && props.updateTemplatePart && props.onTemplatePartChange) {
            props.updateTemplatePart({ ...templatePart, data }, props.onTemplatePartChange);
        }
    }

    function getRenderFields() {
        if (!templatePart?.data) {
            return;
        }

        switch (templatePart.data.modelType) {
            case KeyTypes.Submodel:
                return (
                    <SubmodelEditComponent
                        data={props.templatePart?.data as Submodel}
                        onChange={debouncedOnTemplateDataChange}
                    />
                );
            case KeyTypes.Property:
                return (
                    <PropertyEditComponent
                        data={props.templatePart?.data as Property}
                        onChange={debouncedOnTemplateDataChange}
                    />
                );
            case KeyTypes.MultiLanguageProperty:
                return (
                    <MultiLangEditComponent
                        data={props.templatePart?.data as MultiLanguageProperty}
                        onChange={debouncedOnTemplateDataChange}
                    />
                );
            case KeyTypes.File:
                return (
                    <FileEditComponent
                        data={props.templatePart?.data as ModelFile}
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
                        {t('errors.unknownModelType', { type: `${templatePart.data.modelType}` })}
                    </Typography>
                );
        }
    }

    return (
        <Box key={props.templatePart?.id}>
            <LockedTextField
                label="idShort"
                key={props.templatePart?.data?.idShort}
                defaultValue={props.templatePart?.data?.idShort}
                fullWidth
            />

            {getRenderFields()}

            {props.templatePart?.data && (
                <>
                    <MappingInfoEditComponent
                        data={props.templatePart.data}
                        onChange={debouncedOnTemplateDataChange}
                        key={'mapping-info-' + props.templatePart.data.idShort}
                    />
                    <MultiplicityEditComponent
                        data={props.templatePart.data}
                        onChange={debouncedOnTemplateDataChange}
                        key={'multiplicity-type' + props.templatePart.data.idShort}
                        allowMultiplicityToBeSet={!!props.isCustomTemplate && !props.templatePart.isAboutToBeDeleted}
                    />
                </>
            )}
        </Box>
    );
}
