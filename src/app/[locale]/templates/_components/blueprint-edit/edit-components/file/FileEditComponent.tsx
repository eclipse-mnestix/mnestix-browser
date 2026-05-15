import { AddCircleOutline, RemoveCircleOutline } from '@mui/icons-material';
import { Button, FormControl, InputLabel, MenuItem, Select, TextField } from '@mui/material';
import React from 'react';
import { BlueprintEditSectionHeading } from 'app/[locale]/templates/_components/blueprint-edit/BlueprintEditSectionHeading';
import options from './mime-types.json';
import { useTranslations } from 'next-intl';
import { ModelFile } from 'lib/api/aas/models';

interface FileEditComponentProps {
    data: ModelFile;
    onChange: (data: ModelFile) => void;
}

export function FileEditComponent(props: FileEditComponentProps) {
    const t = useTranslations('pages.templates');
    const defaultValueEnabled = props.data.value !== undefined && props.data.value !== null;

    const onRemove = () => {
        //TODO Reset MimeType to initial value from template on remove
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const { value: _value, ...rest } = props.data;
        props.onChange(rest as ModelFile);
    };

    const onAdd = () => {
        props.onChange({ ...props.data, value: '' });
    };

    const onTextChange = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        props.onChange({ ...props.data, value: event.target.value });
    };

    const onMimeTypeChange = (value: string) => {
        props.onChange({ ...props.data, contentType: value });
    };

    return (
        <>
            <BlueprintEditSectionHeading type="defaultValue" />
            {defaultValueEnabled ? (
                <>
                    <FormControl variant="filled" fullWidth sx={{ mt: 1 }}>
                        <InputLabel id="mime-type-select-label">mimeType</InputLabel>
                        <Select
                            labelId="mime-type-select-label"
                            id="mime-type-select"
                            value={props.data.contentType}
                            label="mimeType"
                            onChange={(v) => onMimeTypeChange(v.target.value)}
                        >
                            {options?.map((option, i) => (
                                <MenuItem value={option} key={i}>
                                    {option}
                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl>
                    <TextField
                        sx={{ mt: 1 }}
                        value={props.data.value ?? ''}
                        label={t('labels.value')}
                        onChange={(e) => onTextChange(e)}
                        fullWidth
                    />
                    <Button size="large" startIcon={<RemoveCircleOutline />} onClick={() => onRemove()}>
                        {t('actions.remove')}
                    </Button>
                </>
            ) : (
                <Button size="large" startIcon={<AddCircleOutline />} onClick={onAdd}>
                    {t('actions.add')}
                </Button>
            )}
        </>
    );
}
