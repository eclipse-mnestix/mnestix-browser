import { Box, Typography } from '@mui/material';
import Grid from '@mui/material/Grid2';
import Link from '@mui/material/Link';
import { useEnv } from 'app/env/provider';
import { useTranslations } from 'next-intl';
import { useState } from 'react';
import { AboutDialog } from 'components/basics/AboutDialog';

export function Footer() {
    const env = useEnv();
    const imprintString = env.IMPRINT_URL;
    const dataPrivacyString = env.DATA_PRIVACY_URL;
    const copyrightString = `Copyright © ${new Date().getFullYear()} XITASO GmbH`;
    const [aboutDialogOpen, setAboutDialogOpen] = useState(false);
    const handleAboutDialogClose = () => {
        setAboutDialogOpen(false);
    };

    const t = useTranslations('footer');

    return (
        <>
            <Box
                sx={{ bottom: 0, left: 0, right: 0, backgroundColor: 'transparent' }}
                flexGrow={1}
                display={'flex'}
                justifyContent={'center'}
                alignItems={'center'}
                flexDirection={'row'}
            >
                <Grid container>
                    <Grid
                        size={{ xs: 12, md: 'auto' }}
                        display={'flex'}
                        justifyContent={'center'}
                        alignItems={'center'}
                    >
                        <Typography color="text.secondary" fontSize="small" mr={2}>
                            {copyrightString}
                        </Typography>
                    </Grid>

                    <Grid
                        size={{ xs: 12, md: 'auto' }}
                        flexDirection={'row'}
                        display={'flex'}
                        justifyContent={'center'}
                        alignItems={'center'}
                    >
                        {dataPrivacyString && (
                            <Typography fontSize="small" maxWidth="150px">
                                <Link href={dataPrivacyString} target="_blank">
                                    {t('dataPrivacy')}
                                </Link>
                            </Typography>
                        )}

                        {dataPrivacyString && imprintString && (
                            <Typography margin={2} color="text.secondary" fontSize="small">
                                |
                            </Typography>
                        )}

                        {imprintString && (
                            <Typography fontSize="small" maxWidth="150px">
                                <Link href={imprintString} target="_blank">
                                    {t('imprint')}
                                </Link>
                            </Typography>
                        )}

                        {imprintString && (
                            <Typography margin={2} color="text.secondary" fontSize="small">
                                |
                            </Typography>
                        )}

                        <Typography
                            fontSize="small"
                            maxWidth="250px"
                            onClick={() => setAboutDialogOpen(!aboutDialogOpen)}
                        >
                            <Link href="#">{t('about')}</Link>
                        </Typography>
                    </Grid>
                </Grid>
            </Box>
            <AboutDialog open={aboutDialogOpen} onClose={handleAboutDialogClose}></AboutDialog>
        </>
    );
}
