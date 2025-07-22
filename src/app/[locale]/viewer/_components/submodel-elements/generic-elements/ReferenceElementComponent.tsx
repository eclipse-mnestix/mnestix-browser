import { ReferenceElement } from '@aas-core-works/aas-core3.0-typescript/types';
import { Typography } from '@mui/material';
import { ReferenceComponent } from './ReferenceComponent';
import { useTranslations } from 'next-intl';

type ReferenceElementComponentProps = {
    readonly refElement: ReferenceElement;
};

export function ReferenceElementComponent(props: ReferenceElementComponentProps) {
    const t = useTranslations('components.referenceElementComponent');

    if (!props.refElement.value || props.refElement.value === undefined) {
        return <Typography variant="body2">{t('noValueSpecified')}</Typography>;
    }

    return <ReferenceComponent reference={props.refElement.value} />;
}
