import { Box, TextField } from '@mui/material';
import { useEffect, useState } from 'react';
import { TemplateEditSectionHeading } from '../TemplateEditSectionHeading';
import { useTranslations } from 'next-intl';
import { Qualifier, Submodel } from 'lib/api/aas/models';

interface SubmodelEditComponentProps {
    data: Submodel;
    onChange: (data: Submodel) => void;
}

export function SubmodelEditComponent(props: SubmodelEditComponentProps) {
    const [data, setData] = useState(props.data);
    const t = useTranslations('pages.templates');

    useEffect(() => {
        setData(props.data);
    }, [props.data]);

    const getDisplayName = () => {
        return data.qualifiers?.find((q: Qualifier) => q.type === 'displayName')?.value;
    };

    const onDisplayNameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        if (data && data.qualifiers) {
            props.onChange({
                ...data,
                qualifiers: data.qualifiers.map((q: Qualifier) => {
                    if (q.type === 'displayName') {
                        q.value = event.target.value;
                    }
                    return q;
                }),
            });
        }
    };

    return (
        <>
            <TemplateEditSectionHeading type="displayName" />
            <Box display="flex" alignContent="center">
                <TextField
                    defaultValue={getDisplayName()}
                    label={t('labels.value')}
                    onChange={onDisplayNameChange}
                    fullWidth
                    slotProps={{
                        htmlInput: {
                            'data-testid': 'display-name-input',
                        },
                    }}
                />
            </Box>
        </>
    );
}
