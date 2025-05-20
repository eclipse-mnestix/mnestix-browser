import { ChevronRight, Home } from '@mui/icons-material';
import { Box, Typography } from '@mui/material';
import NextLink from 'next/link';
import { Fragment } from 'react';

type BreadcrumbsProps = {
    links?: Array<{ label: string; path: string }>;
};

export function Breadcrumbs(props: BreadcrumbsProps) {
    return (
        <Box display="flex" alignItems="center">
            <NextLink href="/" passHref legacyBehavior>
                <Box
                    component="a"
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
                </Box>
            </NextLink>
            <ChevronRight sx={{ color: 'text.secondary', mt: '2px' }} fontSize="small" />
            
            {props.links &&
                props.links.map((link, i) => {
                    const isLast = i === props.links!.length - 1;
                    return (
                        <Fragment key={i}>
                            {link.path ? (
                                <NextLink href={link.path} passHref legacyBehavior>
                                    <Box
                                        component="a"
                                        sx={{
                                            textDecoration: 'none',
                                            color: 'text.secondary',
                                            '&:hover': {
                                                textDecoration: 'underline',
                                            },
                                        }}
                                    >
                                        <Typography component="span">{link.label}</Typography>
                                    </Box>
                                </NextLink>
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