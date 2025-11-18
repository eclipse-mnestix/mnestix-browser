import { AddCircleOutline, RemoveCircleOutline } from '@mui/icons-material';
import { Box, Button, IconButton, TextField } from '@mui/material';
import React, { useMemo, useState } from 'react';
import { MappingInfoData } from 'lib/types/MappingInfoData';
import collectiopnMappingInfoDataJson from './collection-mapping-info-data.json';
import { useTranslations } from 'next-intl';
import { Qualifier, Submodel, SubmodelElementChoice } from 'lib/api/aas/models';
import { BlueprintEditSectionHeading } from '../../../blueprint-edit/BlueprintEditSectionHeading';

interface CollectionMappingInfoEditComponentProps {
    data: Submodel | SubmodelElementChoice;
    onChange: (data: Submodel | SubmodelElementChoice) => void;
}

export function CollectionMappingInfoEditComponent(props: CollectionMappingInfoEditComponentProps) {
    const collectionMappingInfoData = collectiopnMappingInfoDataJson as unknown as MappingInfoData;

    function getMappingInfo(dataSource: Submodel | SubmodelElementChoice): Qualifier | undefined {
        return dataSource?.qualifiers?.find((q: Qualifier) =>
            collectionMappingInfoData.qualifierTypes.includes(q.type),
        );
    }

    const collectionMappingInfo = useMemo(() => getMappingInfo(props.data), [props.data]);
    const [valueEnabled, setValueEnabled] = useState(!!collectionMappingInfo?.value?.length);
    const t = useTranslations('pages.templates');

    function onValueChange(event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) {
        if (collectionMappingInfo) {
            const updatedMappingInfo = { ...collectionMappingInfo, value: event.target.value } as Qualifier;
            handleChange(updatedMappingInfo);
        }
    }

    function onRemove() {
        setValueEnabled(false);
        handleChange(undefined);
    }

    function onAdd() {
        setValueEnabled(true);
        handleChange(collectionMappingInfoData.emptyTemplate);
    }

    function handleChange(newMappingInfo: Qualifier | undefined) {
        const qualifiersIndex = props.data?.qualifiers?.findIndex((q: Qualifier) =>
            collectionMappingInfoData.qualifierTypes.includes(q.type),
        );

        const updatedData = { ...props.data };

        // update/remove if existing
        if (updatedData.qualifiers && qualifiersIndex !== undefined && qualifiersIndex > -1) {
            updatedData.qualifiers = [...updatedData.qualifiers];
            if (newMappingInfo) {
                updatedData.qualifiers[qualifiersIndex] = newMappingInfo;
            } else {
                updatedData.qualifiers.splice(qualifiersIndex, 1);
            }
            // add as new
        } else if (newMappingInfo) {
            updatedData.qualifiers = updatedData.qualifiers
                ? [...updatedData.qualifiers, newMappingInfo]
                : [newMappingInfo];
        }

        props.onChange(updatedData);
    }

    return (
        <>
            <BlueprintEditSectionHeading type="collectionMappingInfo" />
            {valueEnabled && collectionMappingInfo ? (
                <Box display="flex" alignContent="center">
                    <TextField
                        defaultValue={collectionMappingInfo.value}
                        label={t('labels.value')}
                        onChange={onValueChange}
                        fullWidth
                    />
                    <IconButton color="primary" onClick={() => onRemove()} sx={{ alignSelf: 'center', ml: 1 }}>
                        <RemoveCircleOutline />
                    </IconButton>
                </Box>
            ) : (
                <Button size="large" startIcon={<AddCircleOutline />} onClick={() => onAdd()}>
                    {t('actions.add')}
                </Button>
            )}
        </>
    );
}
