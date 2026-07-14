import { Box, Typography } from '@mui/material';
import Grid from '@mui/material/Grid';
import Link from '@mui/material/Link';
import { useEnv } from 'app/EnvProvider';
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

    const t = useTranslations('navigation.footer');

    return (
        <>
            <Box
                sx={{
                    flexGrow: 1,
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    flexDirection: 'row',
                    my: 2,
                    backgroundColor: 'transparent'
                }}>
                <Grid container spacing={2}>
                    <Grid
                        size={{ xs: 12, md: 'auto' }}
                        sx={{
                            display: 'flex',
                            justifyContent: 'center',
                            alignItems: 'center'
                        }}>
                        <Typography
                            sx={{
                                color: 'text.secondary',
                                fontSize: 'small'
                            }}>
                            {copyrightString}
                        </Typography>
                    </Grid>

                    <Grid
                        size={{ xs: 12, md: 'auto' }}
                        sx={{
                            flexDirection: 'row',
                            display: 'flex',
                            justifyContent: 'center',
                            alignItems: 'center'
                        }}>
                        {dataPrivacyString && (
                            <Typography
                                sx={{
                                    fontSize: 'small',
                                    maxWidth: '10rem'
                                }}>
                                <Link href={dataPrivacyString} target="_blank">
                                    {t('dataPrivacy')}
                                </Link>
                            </Typography>
                        )}

                        {dataPrivacyString && (
                            <Typography
                                sx={{
                                    mx: 2,
                                    color: 'text.secondary',
                                    fontSize: 'small'
                                }}>
                                |
                            </Typography>
                        )}

                        {imprintString && (
                            <Typography
                                sx={{
                                    fontSize: 'small',
                                    maxWidth: '10rem'
                                }}>
                                <Link href={imprintString} target="_blank">
                                    {t('imprint')}
                                </Link>
                            </Typography>
                        )}

                        {imprintString && (
                            <Typography
                                sx={{
                                    mx: 2,
                                    color: 'text.secondary',
                                    fontSize: 'small'
                                }}>
                                |
                            </Typography>
                        )}

                        <Typography
                            onClick={() => setAboutDialogOpen(!aboutDialogOpen)}
                            sx={{
                                fontSize: 'small',
                                maxWidth: '10rem'
                            }}>
                            <Link href="#">{t('about')}</Link>
                        </Typography>
                    </Grid>
                </Grid>
            </Box>
            <AboutDialog open={aboutDialogOpen} onClose={handleAboutDialogClose}></AboutDialog>
        </>
    );
}
