'use client';
import { Typography } from '@mui/material';
import { useTranslations } from 'next-intl';

type ListHeaderProps = {
    namespace: string;
    header: string;
    subHeader?: string;
    optionalID?: string;
};

export default function ListHeader(props: ListHeaderProps) {
    const { namespace, header, subHeader, optionalID } = props;
    const t = useTranslations(namespace);

    return (
        <>
            <Typography variant="h2" color="text.primary" textAlign="left" marginBottom={1}>
                {t(header)}
                {optionalID && ` "${optionalID}"`}
            </Typography>
            {subHeader && (
                <Typography variant="body1" color="text.secondary" marginBottom={2} marginTop={0} maxWidth="43.75rem">
                    {t(subHeader)}
                </Typography>
            )}
        </>
    );
}
