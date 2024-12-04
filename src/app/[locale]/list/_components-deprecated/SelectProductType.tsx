import { Box, FormControl, InputLabel, MenuItem, Select, SelectChangeEvent, Typography } from '@mui/material';
import { FormattedMessage, IntlShape, useIntl } from 'react-intl';
import { messages } from 'lib/i18n/localization';
import { Dispatch, SetStateAction, useEffect, useState } from 'react';
import { getProductClassId, parseProductClassFromString, ProductClass } from 'lib/util/ProductClassResolverUtil';
import { AasListEntry } from 'lib/api/generated-api/clients.g';
import { GetProductClassIcon } from './GetProductClassIcon';
import { tooltipText } from 'lib/util/ToolTipText';

type SelectProductTypeProps = {
    aasList: AasListEntry[] | undefined;
    setAasListFiltered: Dispatch<SetStateAction<AasListEntry[] | undefined>>;
};

export const SelectProductType = (props: SelectProductTypeProps) => {
    const { aasList, setAasListFiltered } = props;
    const [productClassFilterValue, setProductClassFilterValue] = useState<string>('');
    const [productClass, setProductClass] = useState<ProductClass[]>([]);
    const [filteredAasListCount, setfilteredAasListCount] = useState(0);
    const intl = useIntl();
    /**
     * Creates the ProductClass Filter values.
     */
    useEffect(() => {
        const productClasses: ProductClass[] = [];
        if (aasList) {
            aasList.forEach((aas) => {
                if (!aas.productGroup) return;
                const productClassId = getProductClassId(aas.productGroup);
                const productClassString = translateProductClassId(productClassId, intl);
                const productClass = parseProductClassFromString(productClassId, productClassString);
                if (!productClasses.find((element) => element.id === productClass.id)) {
                    productClasses.push(productClass);
                }
            });
        }
        setProductClass(productClasses);
    }, [aasList]);

    const translateProductClassId = (id: string, intl: IntlShape) => {
        let productClassString = id;
        try {
            productClassString = intl.formatMessage(messages.mnestix.aasList.productClasses[id]);
        } catch (e) {
            console.warn('Invalid product type', e);
        }
        return productClassString;
    };
    /**
     * Applies product filter change to the list.
     * @param event
     */
    const handleFilterChange = (event: SelectChangeEvent) => {
        setProductClassFilterValue(event.target.value);
        if (!aasList) return;
        if (event.target.value === '') {
            setAasListFiltered(aasList);
        } else {
            const filteredList = aasList.filter((aas) => {
                return aas.productGroup && aas.productGroup.startsWith(event.target.value);
            });
            setAasListFiltered(filteredList);
            setfilteredAasListCount(filteredList.length);
        }
    };

    return (
        <div>
            <FormControl variant="standard" sx={{ minWidth: 120, marginTop: '16px', width: '265px' }}>
                <InputLabel id="product-select">
                    <FormattedMessage {...messages.mnestix.aasList.productClassHeading} />
                </InputLabel>
                <Select
                    labelId="product-select"
                    value={productClassFilterValue}
                    label={<FormattedMessage {...messages.mnestix.aasList.productClassHeading} />}
                    data-testid="product-class-select"
                    onChange={handleFilterChange}
                >
                    <MenuItem value="" data-testid="product-class-select-all">
                        <FormattedMessage {...messages.mnestix.aasList.showAll} />
                    </MenuItem>
                    {productClass.map((productType) => {
                        return (
                            <MenuItem
                                key={productType.id}
                                value={productType.id}
                                data-testid={`product-class-select-${productType.description.replace(' ', '-')}`}
                            >
                                <Typography display="flex" justifyItems="center">
                                    <GetProductClassIcon productClassType={productType.type} />
                                    <Box component="span" sx={{ marginLeft: '5px' }}>
                                        {tooltipText(productType.description, 25)}
                                    </Box>
                                </Typography>
                            </MenuItem>
                        );
                    })}
                </Select>
            </FormControl>
            {productClassFilterValue != '' && (
                <p>
                    {' '}
                    {filteredAasListCount} {intl.formatMessage(messages.mnestix.aasList.productClassHint)}:{' '}
                    <b>{translateProductClassId(productClassFilterValue, intl)}</b>
                </p>
            )}
        </div>
    );
};
