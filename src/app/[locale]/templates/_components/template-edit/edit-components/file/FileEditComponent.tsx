import { AddCircleOutline, RemoveCircleOutline } from '@mui/icons-material';
import { Button, FormControl, InputLabel, MenuItem, Select, TextField } from '@mui/material';
import React, { useEffect, useState } from 'react';
import { TemplateEditSectionHeading } from '../../TemplateEditSectionHeading';
import options from './mime-types.json';
import { useTranslations } from 'next-intl';
import { ModelFile } from 'lib/api/aas/models';

interface FileEditComponentProps {
    data: ModelFile;
    onChange: (data: ModelFile) => void;
}

export function FileEditComponent(props: FileEditComponentProps) {
    const [data, setData] = useState(props.data);
    const [defaultValueEnabled, setDefaultValueEnabled] = useState(!!data.value?.length);
    const t = useTranslations('pages.templates');

    useEffect(() => {
        setData(props.data);
    }, [props.data]);

    const onRemove = () => {
        setDefaultValueEnabled(false);
        //TODO Reset MimeType to initial value from default template on remove
        props.onChange({ ...data, value: '' });
    };

    const onTextChange = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setData({ ...data, value: event.target.value });
        props.onChange({ ...data, value: event.target.value });
    };

    const onMimeTypeChange = (value: string) => {
        setData({ ...data, contentType: value });
        props.onChange({ ...data, contentType: value });
    };

    return (
        <>
            <TemplateEditSectionHeading type="defaultValue" />
            {defaultValueEnabled ? (
                <>
                    <FormControl variant="filled" fullWidth sx={{ mt: 1 }}>
                        <InputLabel id="mime-type-select-label">mimeType</InputLabel>
                        <Select
                            labelId="mime-type-select-label"
                            id="mime-type-select"
                            value={data.contentType}
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
                        defaultValue={data.value}
                        label={t('labels.value')}
                        onChange={(e) => onTextChange(e)}
                        fullWidth
                    />
                    <Button size="large" startIcon={<RemoveCircleOutline />} onClick={() => onRemove()}>
                        {t('actions.remove')}
                    </Button>
                </>
            ) : (
                <Button size="large" startIcon={<AddCircleOutline />} onClick={() => setDefaultValueEnabled(true)}>
                    {t('actions.add')}
                </Button>
            )}
        </>
    );
}
