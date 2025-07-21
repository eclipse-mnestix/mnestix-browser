import { RelationshipElement } from '@aas-core-works/aas-core3.0-typescript/types';
import { Typography } from '@mui/material';
import { ReferenceComponent } from './ReferenceComponent';

type RelationshipElementComponentProps = {
    readonly relElement: RelationshipElement;
};

export function RelationshipElementComponent(props: RelationshipElementComponentProps) {
    if (!props.relElement.first || props.relElement.first === undefined) {
        return <Typography variant="body2">No value specified</Typography>;
    }

    if (!props.relElement.second || props.relElement.second === undefined) {
        return <Typography variant="body2">No value specified</Typography>;
    }

    return (
        <>
            First: <ReferenceComponent reference={props.relElement.first} />
            Second: <ReferenceComponent reference={props.relElement.second} />
        </>
    );
}
