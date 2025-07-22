import { RelationshipElement } from '@aas-core-works/aas-core3.0-typescript/types';
import { Typography } from '@mui/material';
import { ReferenceComponent } from './ReferenceComponent';
import { useTranslations } from 'next-intl';

type RelationshipElementComponentProps = {
    readonly relElement: RelationshipElement;
};

export function RelationshipElementComponent(props: RelationshipElementComponentProps) {
    const t = useTranslations('components.relationshipElementComponent');

    if (!props.relElement.first || props.relElement.first === undefined) {
        return <Typography variant="body2">{t('noValueSpecified')}</Typography>;
    }

    if (!props.relElement.second || props.relElement.second === undefined) {
        return <Typography variant="body2">{t('noValueSpecified')}</Typography>;
    }

    return (
        <>
            {t('first')}: <ReferenceComponent reference={props.relElement.first} showAllKeys={false} />
            {t('second')}: <ReferenceComponent reference={props.relElement.second} showAllKeys={false} />
        </>
    );
}
