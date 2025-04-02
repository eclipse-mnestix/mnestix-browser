import { TextField } from '@mui/material';
import { useState } from 'react';
import { isValidLong } from 'lib/util/LongValidationUtil';
import { useTranslations } from 'next-intl';

interface LongPropertyEditComponentProps {
    dataValue: string;
    onChange: (dataValue: string) => void;
}

export function LongPropertyEditComponent(props: LongPropertyEditComponentProps) {
    const [data, setData] = useState(props.dataValue);
    const [isValidInput, setIsValidInput] = useState(true);
    const t = useTranslations();

    const onValueChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        if (isValidLong(event.target.value) || event.target.value === '') {
            setData(event.target.value);
            props.onChange(event.target.value);
            setIsValidInput(true);
        } else if (event.target.value === '-') {
            setData(event.target.value);
            props.onChange(event.target.value);
            setIsValidInput(false);
        }
    };

    return (
        <TextField
            label={t('common.labels.value')}
            value={data}
            onChange={onValueChange}
            fullWidth
            error={!isValidInput}
            helperText={!isValidInput && t('validation.errors.invalidLong')}
        />
    );
}
