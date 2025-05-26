import { ChevronRight, Home } from '@mui/icons-material';
import { Box, Typography, Link as MuiLink } from '@mui/material';
import NextLink from 'next/link';
import { Fragment } from 'react';

type BreadcrumbsProps = {
    links?: Array<{ label: string; path: string }>;
};

export function Breadcrumbs(props: BreadcrumbsProps) {
    return (
        <Box display="flex" alignItems="center">
            <MuiLink
                component={NextLink}
                href="/"
                sx={{
                    textDecoration: 'none',
                    color: 'text.secondary',
                    display: 'flex',
                    alignItems: 'center',
                    '&:hover': {
                        textDecoration: 'underline',
                    },
                }}
            >
                <Home fontSize="small" />
            </MuiLink>
            <ChevronRight sx={{ color: 'text.secondary', mt: '2px' }} fontSize="small" />

            {props.links &&
                props.links.map((link, i) => {
                    const isLast = i === props.links!.length - 1;
                    return (
                        <Fragment key={i}>
                            {link.path ? (
                                <MuiLink
                                    component={NextLink}
                                    href={link.path}
                                    sx={{
                                        textDecoration: 'none',
                                        color: 'text.secondary',
                                        '&:hover': {
                                            textDecoration: 'underline',
                                        },
                                    }}
                                >
                                    <Typography component="span">{link.label}</Typography>
                                </MuiLink>
                            ) : (
                                <Typography sx={{ color: 'text.secondary' }}>{link.label}</Typography>
                            )}
                            {!isLast && (
                                <ChevronRight sx={{ color: 'text.secondary', mt: '2px' }} fontSize="small" />
                            )}
                        </Fragment>
                    );
                })}
        </Box>
    );
}