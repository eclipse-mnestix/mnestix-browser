import { AddCircleOutline, RemoveCircleOutline } from '@mui/icons-material';
import { Box, Button, IconButton, TextField } from '@mui/material';
import { BlueprintEditSectionHeading } from 'app/[locale]/templates/_components/blueprint-edit/BlueprintEditSectionHeading';
import { Qualifier, Submodel, SubmodelElementChoice } from 'lib/api/aas/models';
import { MappingInfoData } from 'lib/types/MappingInfoData';
import { useTranslations } from 'next-intl';
import React, { useEffect, useState } from 'react';
import mappingInfoDataJson from './mapping-info-data.json';

interface MappingInfoEditComponentProps {
    data: Submodel | SubmodelElementChoice;
    onChange: (data: Submodel | SubmodelElementChoice) => void;
}

export function MappingInfoEditComponent(props: MappingInfoEditComponentProps) {
    const mappingInfoData = mappingInfoDataJson as MappingInfoData;
    const [data, setData] = useState(props.data);

    function getMappingInfo(): Qualifier | undefined {
        return data?.qualifiers?.find((q: Qualifier) => mappingInfoData.qualifierTypes.includes(q.type));
    }
    const [mappingInfo, setMappingInfo] = useState(getMappingInfo());
    const [valueEnabled, setValueEnabled] = useState(!!mappingInfo?.value?.length);
    const t = useTranslations('pages.templates');

    useEffect(() => {
        // useEffect is needed here to update the state when props.data changes, derived state crashed the form
        // eslint-disable-next-line react-hooks/set-state-in-effect
        setData(props.data);
        setMappingInfo(getMappingInfo());
    }, [props.data]);

    const onValueChange = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        if (mappingInfo) {
            setMappingInfo({ ...mappingInfo, value: event.target.value });
            handleChange({ ...mappingInfo, value: event.target.value });
        }
    };

    const onRemove = () => {
        setValueEnabled(false);
        setMappingInfo(undefined);
        handleChange(undefined);
    };

    const onAdd = () => {
        setValueEnabled(true);
        if (!mappingInfo) {
            setMappingInfo(mappingInfoData.emptyTemplate);
        }
        handleChange(mappingInfoData.emptyTemplate);
    };

    const handleChange = (newMappingInfo: Qualifier | undefined) => {
        const qualifiersIndex = props.data?.qualifiers?.findIndex((q: Qualifier) =>
            mappingInfoData.qualifierTypes.includes(q.type),
        );

        let updatedQualifiers = props.data.qualifiers ? [...props.data.qualifiers] : [];

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
        const updatedData = { ...props.data, qualifiers: updatedQualifiers };
        props.onChange(updatedData);
    };

    return (
        <>
            <BlueprintEditSectionHeading type="mappingInfo" />
            {valueEnabled && mappingInfo ? (
                <Box display="flex" alignItems="center">
                    <TextField
                        defaultValue={mappingInfo.value}
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
