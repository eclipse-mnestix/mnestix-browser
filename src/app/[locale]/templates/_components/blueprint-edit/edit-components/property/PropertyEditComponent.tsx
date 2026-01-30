import { AddCircleOutline, RemoveCircleOutline } from '@mui/icons-material';
import { Box, Button, IconButton } from '@mui/material';
import { useState } from 'react';
import { BlueprintEditSectionHeading } from 'app/[locale]/templates/_components/blueprint-edit/BlueprintEditSectionHeading';
import { BooleanPropertyEditComponent } from './data-specific/BooleanPropertyEditComponent';
import { StringPropertyEditComponent } from './data-specific/StringPropertyEditComponent';
import { DatePropertyEditComponent } from './data-specific/DatePropertyEditComponent';
import { LongPropertyEditComponent } from './data-specific/LongPropertyEditComponent';
import { useTranslations } from 'next-intl';
import { DataTypeDefXsd, Property } from 'lib/api/aas/models';

interface PropertyEditComponentProps {
    data: Property;
    onChange: (data: Property) => void;
}

export function PropertyEditComponent(props: PropertyEditComponentProps) {
    const [defaultValueEnabled, setDefaultValueEnabled] = useState(!!props.data.value?.length);
    const t = useTranslations('pages.templates');

    const onValueChange = (value: string) => {
        props.onChange({ ...props.data, value });
    };

    const handleValueRemove = () => {
        setDefaultValueEnabled(false);
        props.onChange({ ...props.data, value: '' });
    };

    const getEditElement = () => {
        switch (props.data.valueType) {
            case DataTypeDefXsd.XsBoolean:
                return (
                    <BooleanPropertyEditComponent
                        dataValue={props.data.value || ''}
                        onChange={onValueChange}
                        defaultValueEnabled
                    />
                );
            case DataTypeDefXsd.XsDate:
                return <DatePropertyEditComponent dataValue={props.data.value || ''} onChange={onValueChange} />;
            case DataTypeDefXsd.XsLong:
                return <LongPropertyEditComponent dataValue={props.data.value || ''} onChange={onValueChange} />;
            default:
                return <StringPropertyEditComponent dataValue={props.data.value || ''} onChange={onValueChange} />;
        }
    };

    return (
        <>
            <BlueprintEditSectionHeading type="defaultValue" />
            {defaultValueEnabled ? (
                <Box display="flex" alignContent="center">
                    {getEditElement()}
                    <IconButton color="primary" onClick={() => handleValueRemove()} sx={{ alignSelf: 'center', ml: 1 }}>
                        <RemoveCircleOutline />
                    </IconButton>
                </Box>
            ) : (
                <Button size="large" startIcon={<AddCircleOutline />} onClick={() => setDefaultValueEnabled(true)}>
                    {t('actions.add')}
                </Button>
            )}
        </>
    );
}
