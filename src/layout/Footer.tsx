import { BottomNavigation, Typography } from '@mui/material';
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
            <BottomNavigation sx={{ bottom: 0, left: 0, right: 0, backgroundColor: 'transparent' }}>
                <Typography
                    color="text.secondary"
                    fontSize="small"
                    mr={2}
                    display="flex"
                    alignItems="center"
                    justifyContent="center"
                >
                    {copyrightString}
                </Typography>

                {dataPrivacyString && (
                    <Typography
                        fontSize="small"
                        display="flex"
                        maxWidth="150px"
                        alignItems={'center'}
                        justifyContent={'center'}
                    >
                        <Link href={dataPrivacyString} target="_blank">
                            {t('dataPrivacy')}
                        </Link>
                    </Typography>
                )}

                {dataPrivacyString && imprintString && (
                    <Typography
                        margin={2}
                        color="text.secondary"
                        fontSize="small"
                        display="flex"
                        alignItems="center"
                        justifyContent="center"
                    >
                        |
                    </Typography>
                )}

                {imprintString && (
                    <Typography
                        fontSize="small"
                        maxWidth="150px"
                        display="flex"
                        alignItems="center"
                        justifyContent="center"
                    >
                        <Link href={imprintString} target="_blank">
                            {t('imprint')}
                        </Link>
                    </Typography>
                )}

                {imprintString && (
                    <Typography
                        margin={2}
                        color="text.secondary"
                        fontSize="small"
                        display="flex"
                        alignItems="center"
                        justifyContent="center"
                    >
                        |
                    </Typography>
                )}

                <Typography
                    fontSize="small"
                    display="flex"
                    alignItems="center"
                    justifyContent="center"
                    maxWidth="250px"
                    onClick={() => setAboutDialogOpen(!aboutDialogOpen)}
                >
                    <Link href="#">{t('about')}</Link>
                </Typography>
            </BottomNavigation>
            <AboutDialog open={aboutDialogOpen} onClose={handleAboutDialogClose}></AboutDialog>
        </>
    );
}
