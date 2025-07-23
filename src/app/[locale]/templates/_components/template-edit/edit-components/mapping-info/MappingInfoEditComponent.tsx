import { AddCircleOutline, RemoveCircleOutline } from '@mui/icons-material';
import { Box, Button, IconButton, TextField } from '@mui/material';
import React, { useEffect, useState } from 'react';
import { MappingInfoData } from 'lib/types/MappingInfoData';
import { TemplateEditSectionHeading } from '../../TemplateEditSectionHeading';
import mappingInfoDataJson from './mapping-info-data.json';
import { useTranslations } from 'next-intl';
import { Qualifier, Submodel, SubmodelElementChoice } from 'lib/api/aas/models';

interface MappingInfoEditComponentProps {
    data: Submodel | SubmodelElementChoice;
    onChange: (data: Submodel | SubmodelElementChoice) => void;
}

export function MappingInfoEditComponent(props: MappingInfoEditComponentProps) {
    const mappingInfoData = mappingInfoDataJson as MappingInfoData;
    const [data, setData] = useState(props.data);
    const [mappingInfo, setMappingInfo] = useState(getMappingInfo());
    const [valueEnabled, setValueEnabled] = useState(!!mappingInfo?.value?.length);
    const t = useTranslations('pages.templates');

    useEffect(() => {
        setData(props.data);
        setMappingInfo(getMappingInfo());
    }, [props.data]);

    function getMappingInfo(): Qualifier | undefined {
        return data?.qualifiers?.find((q: Qualifier) => mappingInfoData.qualifierTypes.includes(q.type));
    }

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
        const qualifiersIndex = data?.qualifiers?.findIndex((q: Qualifier) =>
            mappingInfoData.qualifierTypes.includes(q.type),
        );

        // update/remove if existing
        if (data.qualifiers && qualifiersIndex !== undefined && qualifiersIndex > -1) {
            if (newMappingInfo) {
                data.qualifiers[qualifiersIndex] = newMappingInfo;
            } else {
                data.qualifiers.splice(qualifiersIndex, 1);
            }
            // add as new
        } else if (newMappingInfo) {
            data.qualifiers = data.qualifiers ? [...data.qualifiers, newMappingInfo] : [newMappingInfo];
        }
        props.onChange(data);
    };

    return (
        <>
            <TemplateEditSectionHeading type="mappingInfo" />
            {valueEnabled && mappingInfo ? (
                <Box display="flex" alignContent="center">
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
