import { JSX } from 'react';
import { Box, Typography } from '@mui/material';
import { BaSyxRbacRule } from 'lib/services/rbac-service/RbacRulesService';

type TargetInformationProps = {
    readonly targetInformation: BaSyxRbacRule['targetInformation'];
    readonly isEditMode: boolean;
};
export const TargetInformation = (props: TargetInformationProps) => {
    const permissions: JSX.Element[] = [];
    const keys = Object.keys(props.targetInformation);
    keys.forEach((key) => {
        // @ts-expect-error zod type
        const element = props.targetInformation[key];

        if (key !== '@type')
            permissions.push(
                <Box key={key}>
                    <Typography variant="h5">{key}</Typography>
                    <Typography>{Array.isArray(element) ? element.join(', ') : element}</Typography>
                </Box>,
            );
    });
    return permissions;
};
