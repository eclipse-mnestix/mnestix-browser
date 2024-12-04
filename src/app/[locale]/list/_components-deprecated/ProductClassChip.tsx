import { Chip } from '@mui/material';
import { parseProductClassFromString } from 'lib/util/ProductClassResolverUtil';
import { useIntl } from 'react-intl';
import { messages } from 'lib/i18n/localization';
import { tooltipText } from 'lib/util/ToolTipText';
import { GetProductClassIcon } from 'app/[locale]/list/_components-deprecated/GetProductClassIcon';

type ProductClassChipProps = {
    productClassId: string | null;
    maxChars: number;
};

/**
 * Returns a chip component adjusted for product class element
 */
export const ProductClassChip = (props: ProductClassChipProps) => {
    const { productClassId, maxChars } = props;
    const intl = useIntl();
    if (!productClassId) return '';
    let productClass;
    try {
        productClass = parseProductClassFromString(
            productClassId,
            intl.formatMessage(messages.mnestix.aasList.productClasses[productClassId]),
        );
    } catch (e) {
        console.warn('Invalid product type', e);
    }
    if (!productClass) {
        productClass = parseProductClassFromString(productClassId, productClassId);
    }
    return (
        <Chip
            sx={{ paddingX: '16px', paddingY: '6px' }}
            color='primary'
            label={tooltipText(productClass.description, maxChars)}
            variant="outlined"
            icon={<GetProductClassIcon productClassType={productClass.type} />}
            data-testid="product-class-chip"
            title={intl.formatMessage(messages.mnestix.aasList.productClassHeading) + ' ' + productClass.description}
        />
    );
};
