import { Typography } from '@mui/material';
import React from 'react';
import { BottomNavigation } from '@mui/material';
import Link from '@mui/material/Link';
import { useEnv } from 'app/env/provider';
import { messages } from 'lib/i18n/localization';
import { FormattedMessage } from 'react-intl';

export function Footer() {
    const env = useEnv();
    const imprintString = env.IMPRINT_URL;
    const dataPrivacyString = env.DATA_PRIVACY_URL;
    const copyrightString = `Copyright © ${new Date().getFullYear()} XITASO GmbH`;

    return (
        <>
            <BottomNavigation sx={{ bottom: 0, left: 0, right: 0, backgroundColor: 'transparent' }}>
                <Typography color="text.secondary" fontSize="small" sx={{ marginRight: '15px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    {copyrightString}
                </Typography>

                {dataPrivacyString && (
                    <Typography fontSize="small" sx={{ display: 'flex', maxWidth: '150px', alignItems: 'center', justifyContent: 'center' }}>
                        <Link
                            href={dataPrivacyString}
                            target="_blank"
                        >
                            <FormattedMessage {...messages.mnestix.dataPrivacy} />
                        </Link>
                    </Typography>
                )}

                {dataPrivacyString && imprintString && (
                    <Typography color="text.secondary" fontSize="small" sx={{ margin: '5px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        |
                    </Typography>
                )}

                {imprintString && (
                    <Typography  fontSize="small" sx={{ display: 'flex', maxWidth: '150px', alignItems: 'center', justifyContent: 'center' }}>
                        <Link
                            href={imprintString}
                            target="_blank"
                        >
                            <FormattedMessage {...messages.mnestix.imprint} />
                        </Link>
                    </Typography>
                )}

            </BottomNavigation>
        </>
    );
}
