import { AddCircleOutline, RemoveCircleOutline } from '@mui/icons-material';
import { Autocomplete, Box, Button, IconButton, TextField } from '@mui/material';
import { useEffect, useState } from 'react';
import { TemplateEditSectionHeading } from '../../TemplateEditSectionHeading';
import options from './language-suggestions.json';
import { LangStringTextType, MultiLanguageProperty } from '@aas-core-works/aas-core3.0-typescript/types';
import { useTranslations } from 'next-intl';

interface MultiLangEditComponentProps {
    data: MultiLanguageProperty;
    onChange: (data: MultiLanguageProperty) => void;
}

export function MultiLangEditComponent(props: MultiLangEditComponentProps) {
    const [data, setData] = useState(props.data);
    const [langStrings, setLangStrings] = useState<LangStringTextType[]>(data.value ?? []);
    const t = useTranslations('common');

    useEffect(() => {
        setData(props.data);
        setLangStrings(props.data.value ?? []);
    }, [props.data]);

    const onAdd = () => {
        const newLangStrings = [...langStrings, { language: '', text: '' } as LangStringTextType];
        setLangStrings(newLangStrings);
        props.onChange({ ...data, value: newLangStrings } as MultiLanguageProperty);
    };

    const onRemove = (i: number) => {
        const newLangStrings = [...langStrings.slice(0, i), ...langStrings.slice(i + 1, langStrings.length)];
        setLangStrings(newLangStrings);
        props.onChange({ ...data, value: newLangStrings } as MultiLanguageProperty);
    };

    const onTextChange = (index: number, event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const newLangStrings = langStrings.map((el, i) => {
            if (i === index) {
                el.text = event.target.value;
            }
            return el;
        });
        setLangStrings(newLangStrings);
        props.onChange({ ...data, value: newLangStrings } as MultiLanguageProperty);
    };

    const onLanguageChange = (index: number, value: string) => {
        const newLangStrings = langStrings.map((el, i) => {
            if (i === index) {
                el.language = value;
            }
            return el;
        });
        setLangStrings(newLangStrings);
        props.onChange({ ...data, value: newLangStrings } as MultiLanguageProperty);
    };

    return (
        <>
            <TemplateEditSectionHeading type="defaultValue" />
            {Array.isArray(langStrings) &&
                langStrings.map((langString, i) => (
                    <Box display="flex" alignContent="center" sx={{ mb: 1 }} key={i + '-' + langStrings.length}>
                        <Autocomplete
                            value={langString.language}
                            renderInput={(params) => <TextField {...params} label={t('labels.language')} />}
                            onInputChange={(_, v) => onLanguageChange(i, v)}
                            options={options as string[]}
                            disableClearable
                            freeSolo
                            fullWidth
                            sx={{ maxWidth: '100px', mr: 1 }}
                        />
                        <TextField
                            defaultValue={langString.text}
                            label={t('labels.text')}
                            onChange={(e) => onTextChange(i, e)}
                            fullWidth
                        />
                        <IconButton color="primary" sx={{ alignSelf: 'center', ml: 1 }} onClick={() => onRemove(i)}>
                            <RemoveCircleOutline />
                        </IconButton>
                    </Box>
                ))}
            <Button size="large" startIcon={<AddCircleOutline />} onClick={() => onAdd()}>
                {t('actions.add')}
            </Button>
        </>
    );
}
