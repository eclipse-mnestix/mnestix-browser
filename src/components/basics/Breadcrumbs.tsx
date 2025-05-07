import { ChevronRight, Home } from '@mui/icons-material';
import { Box, Link, Typography } from '@mui/material';
import { Fragment } from 'react';

type BreadcrumbsProps = {
    links?: Array<{ label: string; path: string }>;
};

export function Breadcrumbs(props: BreadcrumbsProps) {
    return (
        <Box display="flex" alignItems="center">
            <Link
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
            </Link>
            <ChevronRight sx={{ color: 'text.secondary', mt: '2px' }} fontSize="small" />
            
            {props.links &&
                props.links.map((link, i) => {
                    return (
                        <Fragment key={i}>
                            {link.path &&
                                <Link
                                    href={link.path}
                                    sx={{
                                        textDecoration: 'none',
                                        color: 'text.secondary',
                                        '&:hover': {
                                            textDecoration: 'underline',
                                        },
                                    }}
                                >
                                    <Typography>{link.label}</Typography>
                                </Link>
                            }
                            {!link.path &&
                                <Typography sx={{ color: 'text.secondary' }}>{link.label}</Typography>
                            }

                            <ChevronRight sx={{ color: 'text.secondary', mt: '2px' }} fontSize="small" />
                        </Fragment>
                    );
                })}
        </Box>
    );
}