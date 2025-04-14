import { Box, IconButton, Link, Tooltip, Typography } from '@mui/material';
import { getTranslationText } from 'lib/util/SubmodelResolverUtil';
import { MultiLanguageProperty } from '@aas-core-works/aas-core3.0-typescript/types';
import { isValidUrl } from 'lib/util/UrlUtil';
import { ContentCopy, OpenInNew } from '@mui/icons-material';
import { useState } from 'react';
import { useNotificationSpawner } from 'lib/hooks/UseNotificationSpawner';
import { useLocale } from 'use-intl';
import { useTranslations } from 'next-intl';

type MultiLanguagePropertyComponentProps = {
    readonly mLangProp: MultiLanguageProperty;
};

export function MultiLanguagePropertyComponent(props: MultiLanguagePropertyComponentProps) {
    const { mLangProp } = props;
    const t = useTranslations('components.propertyComponent');
    const locale = useLocale();
    const value = getTranslationText(mLangProp, locale);
    const [isHovered, setIsHovered] = useState(false);
    const notificationSpawner = useNotificationSpawner();

    const handleCopyValue = () => {
        if (value) {
            navigator.clipboard.writeText(value);
            notificationSpawner.spawn({
                message: t('labels.copied'),
                severity: 'success',
            });
        }
    };

    const renderCopyButton = () => {
        if (!value) return null;
        return (
            <Tooltip title={t('labels.copy')}>
                <IconButton
                    onClick={handleCopyValue}
                    size="small"
                    sx={{ ml: 1, opacity: isHovered ? 1 : 0 }}
                    data-testid="copy-mlproperty-value"
                >
                    <ContentCopy fontSize="small" />
                </IconButton>
            </Tooltip>
        );
    };

    if (isValidUrl(value)) {
        return (
            <Box 
                display="flex" 
                alignItems="center"
                onMouseEnter={() => setIsHovered(true)}
                onMouseLeave={() => setIsHovered(false)}
            >
                <Typography data-testid="mlproperty-content">
                    <Link component="a" href={value!} target="_blank" rel="noopener noreferrer">
                        {value}
                        <OpenInNew fontSize="small" sx={{ verticalAlign: 'middle', ml: 1 }} />
                    </Link>
                </Typography>
                {renderCopyButton()}
            </Box>
        );
    }

    return (
        <Box 
            display="flex" 
            alignItems="center"
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
        >
            <Typography data-testid="mlproperty-content">{value || '-'}</Typography>
            {renderCopyButton()}
        </Box>
    );
}
