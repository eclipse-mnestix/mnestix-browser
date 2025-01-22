'use client';
import { Typography } from '@mui/material';

type ListHeaderProps = {
    header: string;
    subHeader?: string;
    optionalID?: string;
};

export default function ListHeader(props: ListHeaderProps) {
    const { header, subHeader, optionalID } = props;

    return (
        <>
            <Typography variant="h2" color="text.primary" textAlign="left" marginBottom={1}>
                {header}
                {optionalID && ` "${optionalID}"`}
            </Typography>
            {subHeader && (
                <Typography variant="body1" color="text.secondary" marginBottom={2} marginTop={0} maxWidth="43.75rem">
                    {subHeader}
                </Typography>
            )}
        </>
    );
}
