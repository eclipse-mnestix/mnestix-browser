import { Box, TextField } from '@mui/material';
import { useEffect } from 'react';
import { BlueprintEditSectionHeading } from 'app/[locale]/templates/_components/blueprint-edit/BlueprintEditSectionHeading';
import { useTranslations } from 'next-intl';
import { Qualifier, Submodel } from 'lib/api/aas/models';

interface SubmodelEditComponentProps {
    data: Submodel;
    onChange: (data: Submodel) => void;
}

export function SubmodelEditComponent(props: SubmodelEditComponentProps) {
    const t = useTranslations('pages.templates');

    useEffect(() => {
        props.onChange(props.data);
    }, [props.data]);

    const getDisplayName = () => {
        return props.data.qualifiers?.find((q: Qualifier) => q.type === 'displayName')?.value;
    };

    const onDisplayNameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        if (props.data && props.data.qualifiers) {
            props.onChange({
                ...props.data,
                qualifiers: props.data.qualifiers.map((q: Qualifier) => {
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
            <BlueprintEditSectionHeading type="displayName" />
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
