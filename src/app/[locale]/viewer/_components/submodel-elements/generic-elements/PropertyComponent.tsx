import { Link, Typography } from '@mui/material';
import { Property } from '@aas-core-works/aas-core3.0-typescript/types';
import { OpenInNew } from '@mui/icons-material';
import { isValidUrl } from 'lib/util/UrlUtil';
import { useTranslations } from 'next-intl';

type PropertyComponentProps = {
    readonly property: Property;
};

export function PropertyComponent(props: PropertyComponentProps) {
    const { property } = props;
    const t = useTranslations('common');
    if (property && property.value && (property.value === 'true' || property.value === 'false')) {
        return (
            <Typography data-testid="property-content">
                {t(`boolean.${property.value}`)}
            </Typography>
        );
    } else {
        return (
            <Typography data-testid="property-content">
                {isValidUrl(property.value) ? (
                    <Link component="a" href={property.value!} target="_blank" rel="noopener noreferrer">
                        {property.value}
                        <OpenInNew fontSize="small" sx={{ verticalAlign: 'middle', ml: 1 }} />
                    </Link>
                ) : (
                    property.value?.toString() || t('labels.notAvailable')
                )}
            </Typography>
        );
    }
}
