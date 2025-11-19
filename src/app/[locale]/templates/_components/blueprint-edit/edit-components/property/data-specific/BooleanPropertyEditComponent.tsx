import { Box, FormControlLabel, Switch } from '@mui/material';
import { useTranslations } from 'next-intl';

interface BooleanPropertyEditComponentProps {
    dataValue: string;
    onChange: (dataValue: string) => void;
    defaultValueEnabled: boolean;
}

export function BooleanPropertyEditComponent(props: BooleanPropertyEditComponentProps) {
    const t = useTranslations('pages.templates');

    const realBoolean =
        props.defaultValueEnabled && props.dataValue !== 'false' ? true : props.dataValue.toLowerCase() === 'true';

    function onValueChange(event: React.ChangeEvent<HTMLInputElement>) {
        props.onChange(event.target.checked.toString());
    }

    return (
        <Box sx={{ width: '100%', my: 1 }}>
            <FormControlLabel
                control={<Switch checked={realBoolean} onChange={onValueChange} />}
                label={realBoolean ? t('boolean.true') : t('boolean.false')}
            />
        </Box>
    );
}
