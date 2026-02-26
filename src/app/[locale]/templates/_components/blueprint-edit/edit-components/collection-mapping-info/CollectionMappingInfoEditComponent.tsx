import { AddCircleOutline, RemoveCircleOutline } from '@mui/icons-material';
import { Box, Button, IconButton, TextField } from '@mui/material';
import React, { useEffect, useState } from 'react';
import { MappingInfoData } from 'lib/types/MappingInfoData';
import collectiopnMappingInfoDataJson from './collection-mapping-info-data.json';
import { useTranslations } from 'next-intl';
import { Qualifier, Submodel, SubmodelElementChoice } from 'lib/api/aas/models';
import { BlueprintEditSectionHeading } from '../../BlueprintEditSectionHeading';

interface CollectionMappingInfoEditComponentProps {
    data: Submodel | SubmodelElementChoice;
    onChange: (data: Submodel | SubmodelElementChoice) => void;
}

export function CollectionMappingInfoEditComponent(props: CollectionMappingInfoEditComponentProps) {
    const collectionMappingInfoData = collectiopnMappingInfoDataJson as unknown as MappingInfoData;
    const [data, setData] = useState(props.data);

    const getMappingInfo = (): Qualifier | undefined => {
        return data?.qualifiers?.find((q: Qualifier) => collectionMappingInfoData.qualifierTypes.includes(q.type));
    };
    const [collectionMappingInfo, setCollectionMappingInfo] = useState(getMappingInfo());
    const [valueEnabled, setValueEnabled] = useState(!!collectionMappingInfo?.value?.length);
    const t = useTranslations('pages.templates');

    useEffect(() => {
        // useEffect is needed here to update the state when props.data changes, derived state crashed the form
        // eslint-disable-next-line react-hooks/set-state-in-effect
        setData(props.data);
        setCollectionMappingInfo(getMappingInfo());
    }, [props.data]);

    const onValueChange = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        if (collectionMappingInfo) {
            setCollectionMappingInfo({ ...collectionMappingInfo, value: event.target.value } as Qualifier);
            handleChange({ ...collectionMappingInfo, value: event.target.value } as Qualifier);
        }
    };

    const onRemove = () => {
        setValueEnabled(false);
        setCollectionMappingInfo(undefined);
        handleChange(undefined);
    };

    const onAdd = () => {
        setValueEnabled(true);
        if (!collectionMappingInfo) {
            setCollectionMappingInfo(collectionMappingInfoData.emptyTemplate);
        }
        handleChange(collectionMappingInfoData.emptyTemplate);
    };

    const handleChange = (newMappingInfo: Qualifier | undefined) => {
        const qualifiersIndex = props.data?.qualifiers?.findIndex((q: Qualifier) =>
            collectionMappingInfoData.qualifierTypes.includes(q.type),
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
