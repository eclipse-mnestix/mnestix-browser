import { Box, IconButton, Link, Tooltip, Typography } from '@mui/material';
import { Property } from '@aas-core-works/aas-core3.0-typescript/types';
import { messages } from 'lib/i18n/localization';
import { FormattedMessage, useIntl } from 'react-intl';
import { ContentCopy, OpenInNew } from '@mui/icons-material';
import { isValidUrl } from 'lib/util/UrlUtil';
import { useState } from 'react';
import { useNotificationSpawner } from 'lib/hooks/UseNotificationSpawner';

type PropertyComponentProps = {
    readonly property: Property;
};

export function PropertyComponent(props: PropertyComponentProps) {
    const { property } = props;
    const [isHovered, setIsHovered] = useState(false);
    const notificationSpawner = useNotificationSpawner();
    const intl = useIntl();

    const handleCopyValue = () => {
        if (property.value) {
            navigator.clipboard.writeText(property.value.toString());
            notificationSpawner.spawn({
                message: intl.formatMessage(messages.mnestix.copied),
                severity: 'success',
            });
        }
    };

    const renderCopyButton = () => {
        if (!property.value) return null;
        return (
            <Tooltip title={intl.formatMessage(messages.mnestix.copy)}>
                <IconButton
                    onClick={handleCopyValue}
                    size="small"
                    sx={{ ml: 1, opacity: isHovered ? 1 : 0 }}
                    data-testid="copy-property-value"
                >
                    <ContentCopy fontSize="small" />
                </IconButton>
            </Tooltip>
        );
    };

    if (property && property.value && (property.value === 'true' || property.value === 'false')) {
        return (
            <Box 
                display="flex" 
                alignItems="center" 
                onMouseEnter={() => setIsHovered(true)}
                onMouseLeave={() => setIsHovered(false)}
            >
                <Typography data-testid="property-content">
                    <FormattedMessage {...messages.mnestix.boolean[property.value]} />
                </Typography>
                {renderCopyButton()}
            </Box>
        );
    } else {
        return (
            <Box 
                display="flex" 
                alignItems="center"
                onMouseEnter={() => setIsHovered(true)}
                onMouseLeave={() => setIsHovered(false)}
            >
                <Typography data-testid="property-content">
                    {isValidUrl(property.value) ? (
                        <Link component="a" href={property.value!} target="_blank" rel="noopener noreferrer">
                            {property.value}
                            <OpenInNew fontSize="small" sx={{ verticalAlign: 'middle', ml: 1 }} />
                        </Link>
                    ) : (
                        property.value?.toString() || <FormattedMessage {...messages.mnestix.notAvailable} />
                    )}
                </Typography>
                {renderCopyButton()}
            </Box>
        );
    }
}
