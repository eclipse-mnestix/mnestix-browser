import { JSX } from 'react';
import { Box, Typography } from '@mui/material';
import { BaSyxRbacRule } from 'lib/services/rbac-service/types/RbacServiceData';
import { useTranslations } from 'next-intl';

type TargetInformationProps = {
    readonly targetInformation: BaSyxRbacRule['targetInformation'];
};
export const TargetInformationView = (props: TargetInformationProps) => {
    const t = useTranslations('pages.settings');
    const permissions: JSX.Element[] = [];
    const keys = Object.keys(props.targetInformation);

    keys.forEach((key) => {
        // @ts-expect-error implicit any
        const element = props.targetInformation[key];

        if (key === '@type') {
            return;
        }
        const ids = element as string[];
        permissions.push(
            <Box key={key} mt="1em">
                <Typography variant="h5">{key}</Typography>
                <Typography>{ids.join(', ')}</Typography>
            </Box>,
        );
    });
    return (
        <Box data-testid="role-target-information-view">
            <Typography variant="h5">{t('rules.tableHeader.type')}</Typography>
            <Typography>{props.targetInformation['@type']}</Typography>
            {permissions}
        </Box>
    );
};
