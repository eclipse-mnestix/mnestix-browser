import { ReferenceElement } from '@aas-core-works/aas-core3.0-typescript/types';
import { Typography } from '@mui/material';
import { ReferenceComponent } from './ReferenceComponent';

type ReferenceElementComponentProps = {
    readonly refElement: ReferenceElement;
};

export function ReferenceElementComponent(props: ReferenceElementComponentProps) {
    if (!props.refElement.value || props.refElement.value === undefined) {
        return <Typography variant="body2">No value specified</Typography>;
    }

    return <ReferenceComponent reference={props.refElement.value} />;
}
