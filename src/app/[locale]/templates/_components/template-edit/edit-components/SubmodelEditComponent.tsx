import { Box, TextField } from '@mui/material';
import { useEffect, useState } from 'react';
import { TemplateEditSectionHeading } from '../TemplateEditSectionHeading';
import { Qualifier, Submodel } from '@aas-core-works/aas-core3.0-typescript/types';
import { useTranslations } from 'next-intl';

interface SubmodelEditComponentProps {
    data: Submodel;
    onChange: (data: Submodel) => void;
}

export function SubmodelEditComponent(props: SubmodelEditComponentProps) {
    const [data, setData] = useState(props.data);
    const t = useTranslations('common');

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
            } as Submodel);
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
                />
            </Box>
        </>
    );
}
