'use client';
import { Paper, TableCell } from '@mui/material';
import React from 'react';

type PictureTableCellProps = {
    children?: React.ReactNode;
    title?: string;
};

const tableBodyText = {
    lineHeight: '150%',
    fontSize: '16px',
    color: 'text.primary',
};

export default function PictureTableCell(props: PictureTableCellProps) {
    const { children, title } = props;

    return (
        <TableCell component="th" scope="row" sx={tableBodyText}>
            <Paper
                sx={{
                    width: '100px',
                    height: '100px',
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                }}
                data-testid="list-thumbnail"
                title={title ?? undefined}
            >
                {children}
            </Paper>
        </TableCell>
    );
}
