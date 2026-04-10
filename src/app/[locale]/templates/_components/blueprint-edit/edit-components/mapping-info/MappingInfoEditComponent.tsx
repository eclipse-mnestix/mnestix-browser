import { AddCircleOutline, RemoveCircleOutline } from '@mui/icons-material';
import { Box, Button, IconButton, TextField } from '@mui/material';
import { BlueprintEditSectionHeading } from 'app/[locale]/templates/_components/blueprint-edit/BlueprintEditSectionHeading';
import { Qualifier, Submodel, SubmodelElementChoice } from 'lib/api/aas/models';
import { MappingInfoData } from 'lib/types/MappingInfoData';
import { useTranslations } from 'next-intl';
import React from 'react';

interface MappingInfoEditComponentProps {
    data: Submodel | SubmodelElementChoice;
    onChange: (data: Submodel | SubmodelElementChoice) => void;
    mappingInfoData: MappingInfoData;
    headingType: 'mappingInfo' | 'collectionMappingInfo' | 'filterMappingInfo';
}

/**
 * Generic controlled component for editing mapping info qualifiers.
 * Handles MappingInfo, CollectionMappingInfo, and FilterMappingInfo
 * by accepting the appropriate config and heading type as props.
 */
export function MappingInfoEditComponent(props: MappingInfoEditComponentProps) {
    const { data, onChange, mappingInfoData, headingType } = props;
    const mappingInfo = data?.qualifiers?.find((q: Qualifier) => mappingInfoData.qualifierTypes.includes(q.type));
    const t = useTranslations('pages.templates');

    function onValueChange(event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) {
        if (mappingInfo) {
            handleChange({ ...mappingInfo, value: event.target.value });
        }
    }

    function onRemove() {
        handleChange(undefined);
    }

    function onAdd() {
        handleChange(mappingInfoData.emptyTemplate);
    }

    function handleChange(newMappingInfo: Qualifier | undefined) {
        const qualifiersIndex = data?.qualifiers?.findIndex((q: Qualifier) =>
            mappingInfoData.qualifierTypes.includes(q.type),
        );

        let updatedQualifiers = data.qualifiers ? [...data.qualifiers] : [];

        // update/remove if existing
        if (qualifiersIndex !== undefined && qualifiersIndex > -1) {
            if (newMappingInfo) {
                updatedQualifiers[qualifiersIndex] = newMappingInfo;
            } else {
                updatedQualifiers.splice(qualifiersIndex, 1);
            }
            // add as new
        } else if (newMappingInfo) {
            updatedQualifiers = [...updatedQualifiers, newMappingInfo];
        }

        const updatedData = { ...data, qualifiers: updatedQualifiers };
        onChange(updatedData);
    }

    return (
        <>
            <BlueprintEditSectionHeading type={headingType} />
            {mappingInfo ? (
                <Box display="flex" alignItems="center">
                    <TextField
                        defaultValue={mappingInfo.value}
                        label={t('labels.value')}
                        onChange={onValueChange}
                        fullWidth
                    />
                    <IconButton color="primary" onClick={onRemove} sx={{ alignSelf: 'center', ml: 1 }}>
                        <RemoveCircleOutline />
                    </IconButton>
                </Box>
            ) : (
                <Button size="large" startIcon={<AddCircleOutline />} onClick={onAdd}>
                    {t('actions.add')}
                </Button>
            )}
        </>
    );
}
