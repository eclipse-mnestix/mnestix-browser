import { Box, IconButton, Link, Skeleton, Tooltip, Typography } from '@mui/material';
import { MultiLanguageProperty, Property, Range } from '@aas-core-works/aas-core3.0-typescript/types';
import { getTranslationText } from 'lib/util/SubmodelResolverUtil';
import { isValidUrl } from 'lib/util/UrlUtil';
import { ContentCopy, OpenInNew } from '@mui/icons-material';
import { useState } from 'react';
import { useNotificationSpawner } from 'lib/hooks/UseNotificationSpawner';
import { useLocale } from 'use-intl';
import { useTranslations } from 'next-intl';
import { ConceptDescription } from '@aas-core-works/aas-core3.0-typescript/dist/types/types';
import { getUnitFromConceptDescription } from 'app/[locale]/viewer/_components/submodel/technical-data/ConceptDescriptionHelper';

type GenericPropertyComponentProps = {
    readonly property?: Property;
    readonly mLangProp?: MultiLanguageProperty;
    readonly range?: Range;
    readonly withCopyButton?: boolean;
    readonly conceptDescription?: ConceptDescription;
    readonly conceptDescriptionLoading?: boolean;
};

/**
 * A component that can render either a Property or MultiLanguageProperty
 * with a copy button and unit from concept description
 */
export function GenericPropertyComponent(props: GenericPropertyComponentProps) {
    const { property, mLangProp, range, withCopyButton = true, conceptDescription, conceptDescriptionLoading } = props;
    const t = useTranslations('components.propertyComponent');
    const locale = useLocale();
    const [isHovered, setIsHovered] = useState(false);
    const notificationSpawner = useNotificationSpawner();

    let value: string | null = null;
    if (mLangProp) {
        value = getTranslationText(mLangProp, locale);
    } else if (property) {
        value = property.value?.toString() || null;
    } else if (range) {
        value = `min: ${range.min}, max: ${range.max}`;
    }

    const handleCopyValue = () => {
        let copiedValue = value;
        if (copiedValue) {
            if (!conceptDescriptionLoading && conceptDescription?.embeddedDataSpecifications?.[0]?.dataSpecificationContent) {
                copiedValue += ' ' + getUnitFromConceptDescription(conceptDescription)
            }

            navigator.clipboard.writeText(copiedValue);
            notificationSpawner.spawn({
                message: t('labels.copied') + ': ' + copiedValue,
                severity: 'success',
            });
        }
    };

    const renderCopyButton = () => {
        if (!withCopyButton || !value) return null;
        return (
            <Tooltip title={t('labels.copy')}>
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

    // Special case for boolean values
    if (property && property.value && (property.value === 'true' || property.value === 'false')) {
        return (
            <Box
                display="flex"
                alignItems="center"
                onMouseEnter={() => setIsHovered(true)}
                onMouseLeave={() => setIsHovered(false)}
            >
                <Typography data-testid="property-content">{t(`boolean.${property.value}`)}</Typography>
                {renderCopyButton()}

            </Box>
        );
    }

    // Special case for URL values
    if (isValidUrl(value)) {
        return (
            <Box
                display="flex"
                alignItems="center"
                onMouseEnter={() => setIsHovered(true)}
                onMouseLeave={() => setIsHovered(false)}
            >
                <Typography data-testid="property-content">
                    <Link component="a" href={value!} target="_blank" rel="noopener noreferrer">
                        {value}
                        <OpenInNew fontSize="small" sx={{ verticalAlign: 'middle', ml: 1 }} />
                    </Link>
                </Typography>
                {renderCopyButton()}

            </Box>
        );
    }

    // Default case for normal text values
    return (
        <Box
            display="flex"
            alignItems="center"
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}>

            <Typography data-testid="property-content">
                {value || t('labels.notAvailable')}
                <span> </span>
                {!conceptDescriptionLoading && (
                    conceptDescription &&
                    conceptDescription.embeddedDataSpecifications?.[0]?.dataSpecificationContent &&
                    (
                        <span data-testid="property-unit" > {getUnitFromConceptDescription(conceptDescription)}</span>
                    )
                )}
            </Typography>

            {
                conceptDescriptionLoading && (
                    <Skeleton width="30px" sx={{ ml: 0.5 }} />
                )
            }

            {renderCopyButton()}
        </Box>
    );
}
