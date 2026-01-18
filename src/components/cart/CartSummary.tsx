'use client';

import { Box, Button, Divider, Paper, Typography } from '@mui/material';
import { useTranslations } from 'next-intl';
import { useCart } from 'components/contexts/CartContext';

/**
 * Displays the cart summary with total price and checkout button.
 * Calculates the total from all cart items and displays it in a formatted manner.
 */
export function CartSummary() {
    const t = useTranslations('pages.cart');
    const { getTotalPrice, cartItems } = useCart();

    const totalPrice = getTotalPrice();
    const currency = cartItems[0]?.currency ?? 'EUR';

    function formatPrice(price: number): string {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: currency,
        }).format(price);
    }

    function handleCheckout() {
        // Checkout process is out of scope - placeholder for future implementation
    }

    return (
        <Paper sx={{ p: 3, mt: 3 }} data-testid="cart-summary">
            <Box display="flex" flexDirection="column" gap={2}>
                <Box display="flex" justifyContent="space-between" alignItems="center">
                    <Typography variant="h6" fontWeight="bold">
                        {t('totalPrice')}
                    </Typography>
                    <Typography variant="h6" fontWeight="bold" data-testid="cart-total-price">
                        {formatPrice(totalPrice)}
                    </Typography>
                </Box>
                <Divider />
                <Box display="flex" justifyContent="flex-end">
                    <Button
                        variant="contained"
                        color="primary"
                        size="large"
                        onClick={handleCheckout}
                        data-testid="checkout-button"
                    >
                        {t('checkout')}
                    </Button>
                </Box>
            </Box>
        </Paper>
    );
}
