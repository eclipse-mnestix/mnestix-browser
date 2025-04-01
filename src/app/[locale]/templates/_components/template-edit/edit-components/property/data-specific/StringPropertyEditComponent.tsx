import { TextField } from '@mui/material';
import { useTranslations } from 'next-intl';

interface StringPropertyEditComponentProps {
    dataValue: string;
    onChange: (dataValue: string) => void;
}

export function StringPropertyEditComponent(props: StringPropertyEditComponentProps) {
    const t = useTranslations();
    const onValueChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        props.onChange(event.target.value);
    };

    return (
        <TextField
            defaultValue={props.dataValue}
            label={t('common.labels.value')}
            onChange={onValueChange}
            fullWidth
        />
    );
}
