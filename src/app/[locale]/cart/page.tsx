'use client';

import { Box } from '@mui/material';
import ListHeader from 'components/basics/ListHeader';
import { useTranslations } from 'next-intl';
import { useCart } from 'components/contexts/CartContext';
import { CartItemList } from 'components/cart/CartItemList';
import { CartSummary } from 'components/cart/CartSummary';
import { EmptyCartMessage } from 'components/cart/EmptyCartMessage';

export default function Page() {
    const t = useTranslations('pages.cart');
    const { cartItems } = useCart();

    const isEmpty = cartItems.length === 0;

    return (
        <Box display="flex" flexDirection="column" marginTop="0px" marginBottom="50px" width="100%">
            <Box width="90%" margin="auto">
                <Box marginTop="2rem" marginBottom="2.25rem">
                    <ListHeader header={t('header')} subHeader={isEmpty ? undefined : t('subHeader')} />
                </Box>
                {isEmpty ? (
                    <EmptyCartMessage />
                ) : (
                    <>
                        <CartItemList />
                        <CartSummary />
                    </>
                )}
            </Box>
        </Box>
    );
}
