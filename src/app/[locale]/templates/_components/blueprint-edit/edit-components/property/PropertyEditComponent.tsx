import { AddCircleOutline, RemoveCircleOutline } from '@mui/icons-material';
import { Box, Button, IconButton, Typography } from '@mui/material';
import { BlueprintEditSectionHeading } from 'app/[locale]/templates/_components/blueprint-edit/BlueprintEditSectionHeading';
import { DataTypeDefXsd, Property } from 'lib/api/aas/models';
import { useTranslations } from 'next-intl';
import { BooleanPropertyEditComponent } from './data-specific/BooleanPropertyEditComponent';
import { DatePropertyEditComponent } from './data-specific/DatePropertyEditComponent';
import { LongPropertyEditComponent } from './data-specific/LongPropertyEditComponent';
import { StringPropertyEditComponent } from './data-specific/StringPropertyEditComponent';

interface PropertyEditComponentProps {
    data: Property;
    onChange: (data: Property) => void;
}

export function PropertyEditComponent(props: PropertyEditComponentProps) {
    const t = useTranslations('pages.templates');
    const defaultValueEnabled = props.data.value !== undefined && props.data.value !== null;

    const onValueChange = (value: string) => {
        props.onChange({ ...props.data, value });
    };

    const handleValueRemove = () => {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const { value, ...rest } = props.data;
        props.onChange(rest as Property);
    };

    const handleValueAdd = () => {
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
            <Box display="flex" alignItems="center" justifyContent="space-between" sx={{ mt: 1 }}>
                <Typography variant="body2" color="text.secondary">
                    {t('labels.valueType')}
                </Typography>
                <Box display="flex" alignItems="center">
                    <Typography variant="subtitle2" sx={{ ml: 2 }}>
                        {props.data.valueType}
                    </Typography>
                </Box>
            </Box>
            <BlueprintEditSectionHeading type="defaultValue" />
            {defaultValueEnabled ? (
                <Box display="flex" alignContent="center">
                    {getEditElement()}
                    <IconButton color="primary" onClick={() => handleValueRemove()} sx={{ alignSelf: 'center', ml: 1 }}>
                        <RemoveCircleOutline />
                    </IconButton>
                </Box>
            ) : (
                <Button size="large" startIcon={<AddCircleOutline />} onClick={handleValueAdd}>
                    {t('actions.add')}
                </Button>
            )}
        </>
    );
}
