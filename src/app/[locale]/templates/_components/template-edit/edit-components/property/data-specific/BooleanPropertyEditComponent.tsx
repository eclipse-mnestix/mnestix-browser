import { Box, FormControlLabel, Switch } from '@mui/material';
import { useEffect, useState } from 'react';
import { useTranslations } from 'next-intl';

interface BooleanPropertyEditComponentProps {
    dataValue: string;
    onChange: (dataValue: string) => void;
    defaultValueEnabled: boolean;
}

export function BooleanPropertyEditComponent(props: BooleanPropertyEditComponentProps) {
    const [realBoolean, setRealBoolean] = useState(props.dataValue.toLowerCase() === 'true');
    const t = useTranslations('common');

    useEffect(() => {
        // intial value should be true
        if (props.defaultValueEnabled && props.dataValue !== 'false') {
            setRealBoolean(true);
            props.onChange('true');
        }
         
    }, [props.defaultValueEnabled]);

    const onValueChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setRealBoolean(event.target.checked);
        props.onChange(event.target.checked.toString());
    };

    return (
        <Box sx={{ width: '100%', my: 1 }}>
            <FormControlLabel
                control={<Switch checked={realBoolean} onChange={onValueChange} />}
                label={
                    realBoolean ? (
                        t('boolean.true')
                    ) : (
                        t('boolean.false')
                    )
                }
            />
        </Box>
    );
}
