import { AddCircleOutline, RemoveCircleOutline } from '@mui/icons-material';
import { Box, Button, IconButton, TextField } from '@mui/material';
import { MappingInfoData } from 'lib/types/MappingInfoData';
import { useTranslations } from 'next-intl';
import Image from 'next/image';
import React, { useEffect, useState } from 'react';
import filterMappingInfoDataJSON from './filter-mapping-info.json';

import { Qualifier, Submodel, SubmodelElementChoice } from 'lib/api/aas/models';
import { BlueprintEditSectionHeading } from '../../BlueprintEditSectionHeading';

interface FilterMappingInfoEditComponentProps {
    data: Submodel | SubmodelElementChoice;
    onChange: (data: Submodel | SubmodelElementChoice) => void;
}

export function FilterMappingInfoEditComponent(props: FilterMappingInfoEditComponentProps) {
    const filterMappingInfoData = filterMappingInfoDataJSON as unknown as MappingInfoData;
    const [data, setData] = useState(props.data);

    const getMappingInfo = (): Qualifier | undefined => {
        return data?.qualifiers?.find((q: Qualifier) => filterMappingInfoData.qualifierTypes.includes(q.type));
    };
    const [filterMappingInfo, setFilterMappingInfo] = useState(getMappingInfo());
    const [valueEnabled, setValueEnabled] = useState(!!filterMappingInfo?.value?.length);
    const t = useTranslations('pages.templates');

    useEffect(() => {
        // useEffect is needed here to update the state when props.data changes, derived state crashed the form
        // eslint-disable-next-line react-hooks/set-state-in-effect
        setData(props.data);
        setFilterMappingInfo(getMappingInfo());
    }, [props.data]);

    const onValueChange = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        if (filterMappingInfo) {
            setFilterMappingInfo({ ...filterMappingInfo, value: event.target.value } as Qualifier);
            handleChange({ ...filterMappingInfo, value: event.target.value } as Qualifier);
        }
    };

    const onRemove = () => {
        setValueEnabled(false);
        setFilterMappingInfo(undefined);
        handleChange(undefined);
    };

    const onAdd = () => {
        setValueEnabled(true);
        if (!filterMappingInfo) {
            setFilterMappingInfo(filterMappingInfoData.emptyTemplate);
        }
        handleChange(filterMappingInfoData.emptyTemplate);
    };

    const handleChange = (newMappingInfo: Qualifier | undefined) => {
        const qualifiersIndex = props.data?.qualifiers?.findIndex((q: Qualifier) =>
            filterMappingInfoData.qualifierTypes.includes(q.type),
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
            <BlueprintEditSectionHeading type="filterMappingInfo" />
            {valueEnabled && filterMappingInfo ? (
                <Box display="flex" alignItems="center">
                    <Image src="/images/JsonataLogo.png" alt="JSONATA-Logo" width={30} height={30} />

                    <TextField
                        defaultValue={filterMappingInfo.value}
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
