import { AddCircleOutline, RemoveCircleOutline } from '@mui/icons-material';
import { Box, Button, IconButton, TextField } from '@mui/material';
import React, { useMemo, useState } from 'react';
import { MappingInfoData } from 'lib/types/MappingInfoData';
import { BlueprintEditSectionHeading } from 'app/[locale]/templates/_components/blueprint-edit/BlueprintEditSectionHeading';
import mappingInfoDataJson from './mapping-info-data.json';
import { useTranslations } from 'next-intl';
import { Qualifier, Submodel, SubmodelElementChoice } from 'lib/api/aas/models';

interface MappingInfoEditComponentProps {
    data: Submodel | SubmodelElementChoice;
    onChange: (data: Submodel | SubmodelElementChoice) => void;
}

export function MappingInfoEditComponent(props: MappingInfoEditComponentProps) {
    const mappingInfoData = mappingInfoDataJson as MappingInfoData;

    const mappingInfo = useMemo(() => {
        return props.data?.qualifiers?.find((q: Qualifier) => mappingInfoData.qualifierTypes.includes(q.type));
    }, [props.data, mappingInfoData.qualifierTypes]);

    const [valueEnabled, setValueEnabled] = useState(!!mappingInfo?.value?.length);
    const t = useTranslations('pages.templates');

    function onValueChange(event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) {
        if (mappingInfo) {
            const updatedMappingInfo = { ...mappingInfo, value: event.target.value };
            handleChange(updatedMappingInfo);
        }
    }

    function onRemove() {
        setValueEnabled(false);
        handleChange(undefined);
    }

    function onAdd() {
        setValueEnabled(true);
        handleChange(mappingInfoData.emptyTemplate);
    }

    function handleChange(newMappingInfo: Qualifier | undefined) {
        const qualifiersIndex = props.data?.qualifiers?.findIndex((q: Qualifier) =>
            mappingInfoData.qualifierTypes.includes(q.type),
        );

        let updatedData = { ...props.data };

        // update/remove if existing
        if (updatedData.qualifiers && qualifiersIndex !== undefined && qualifiersIndex > -1) {
            if (newMappingInfo) {
                updatedData = {
                    ...updatedData,
                    qualifiers: updatedData.qualifiers.map((q, index) =>
                        index === qualifiersIndex ? newMappingInfo : q,
                    ),
                };
            } else {
                updatedData = {
                    ...updatedData,
                    qualifiers: updatedData.qualifiers.filter((_, index) => index !== qualifiersIndex),
                };
            }
            // add as new
        } else if (newMappingInfo) {
            updatedData = {
                ...updatedData,
                qualifiers: updatedData.qualifiers ? [...updatedData.qualifiers, newMappingInfo] : [newMappingInfo],
            };
        }

        props.onChange(updatedData);
    }

    return (
        <>
            <BlueprintEditSectionHeading type="mappingInfo" />
            {valueEnabled && mappingInfo ? (
                <Box display="flex" alignContent="center">
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
