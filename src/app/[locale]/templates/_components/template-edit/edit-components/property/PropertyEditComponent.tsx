import { AddCircleOutline, RemoveCircleOutline } from '@mui/icons-material';
import { Box, Button, IconButton } from '@mui/material';
import { useEffect, useState } from 'react';
import { getValueType } from 'lib/util/SubmodelResolverUtil';
import { TemplateEditSectionHeading } from '../../TemplateEditSectionHeading';
import { BooleanPropertyEditComponent } from './data-specific/BooleanPropertyEditComponent';
import { StringPropertyEditComponent } from './data-specific/StringPropertyEditComponent';
import { DatePropertyEditComponent } from './data-specific/DatePropertyEditComponent';
import { LongPropertyEditComponent } from './data-specific/LongPropertyEditComponent';
import { DataTypeDefXsd, Property } from '@aas-core-works/aas-core3.0-typescript/types';
import { useTranslations } from 'next-intl';

interface PropertyEditComponentProps {
    data: Property;
    onChange: (data: Property) => void;
}

export function PropertyEditComponent(props: PropertyEditComponentProps) {
    const [data, setData] = useState(props.data);
    const [defaultValueEnabled, setDefaultValueEnabled] = useState(!!data.value?.length);
    const t = useTranslations();

    useEffect(() => {
        setData(props.data);
    }, [props.data]);

    const onValueChange = (value: string) => {
        props.onChange({ ...data, value } as Property);
    };

    const handleValueRemove = () => {
        setDefaultValueEnabled(false);
        props.onChange({ ...data, value: '' } as Property);
    };

    const getEditElement = () => {
        const valueType: DataTypeDefXsd = getValueType(props.data);
        switch (valueType) {
            case DataTypeDefXsd.Boolean:
                return (
                    <BooleanPropertyEditComponent
                        dataValue={data.value || ''}
                        onChange={onValueChange}
                        defaultValueEnabled
                    />
                );
            case DataTypeDefXsd.Date:
                return <DatePropertyEditComponent dataValue={data.value || ''} onChange={onValueChange} />;
            case DataTypeDefXsd.Long:
                return <LongPropertyEditComponent dataValue={data.value || ''} onChange={onValueChange} />;
            default:
                return <StringPropertyEditComponent dataValue={data.value || ''} onChange={onValueChange} />;
        }
    };

    return (
        <>
            <TemplateEditSectionHeading type="defaultValue" />
            {defaultValueEnabled ? (
                <Box display="flex" alignContent="center">
                    {getEditElement()}
                    <IconButton color="primary" onClick={() => handleValueRemove()} sx={{ alignSelf: 'center', ml: 1 }}>
                        <RemoveCircleOutline />
                    </IconButton>
                </Box>
            ) : (
                <Button size="large" startIcon={<AddCircleOutline />} onClick={() => setDefaultValueEnabled(true)}>
                    {t('common.actions.add')}
                </Button>
            )}
        </>
    );
}
