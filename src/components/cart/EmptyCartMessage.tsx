'use client';

import { Box, Button, Typography } from '@mui/material';
import { ShoppingCartOutlined } from '@mui/icons-material';
import { useTranslations } from 'next-intl';
import { useRouter } from 'next/navigation';

/**
 * Displays a message when the shopping cart is empty.
 * Shows an empty cart icon, a message, and a button to navigate back to the product listing.
 */
export function EmptyCartMessage() {
    const t = useTranslations('pages.cart');
    const router = useRouter();

    function handleBackToProducts() {
        router.push('/marketplace');
    }

    return (
        <Box
            display="flex"
            flexDirection="column"
            alignItems="center"
            justifyContent="center"
            py={8}
            textAlign="center"
            data-testid="empty-cart-message"
        >
            <ShoppingCartOutlined
                sx={{
                    fontSize: 80,
                    color: 'text.secondary',
                    mb: 2,
                }}
                aria-hidden="true"
            />
            <Typography variant="h5" color="text.primary" mb={3}>
                {t('emptyCartMessage')}
            </Typography>
            <Button
                variant="contained"
                color="primary"
                onClick={handleBackToProducts}
                data-testid="back-to-products-button"
            >
                {t('backToProducts')}
            </Button>
        </Box>
    );
}
