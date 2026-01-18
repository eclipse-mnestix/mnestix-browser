'use client';

import { Box, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, useMediaQuery, useTheme } from '@mui/material';
import { useTranslations } from 'next-intl';
import { useCart } from 'components/contexts/CartContext';
import { CartItemRow } from 'components/cart/CartItemRow';

const tableHeaderText = {
    fontWeight: 'bold',
    color: 'text.primary',
};

/**
 * Displays a list of cart items in a responsive table format.
 * Shows product details, quantity controls, prices, and remove actions.
 * Uses table layout on desktop and card layout on mobile.
 */
export function CartItemList() {
    const t = useTranslations('pages.cart');
    const { cartItems } = useCart();
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('md'));

    if (isMobile) {
        return (
            <Box display="flex" flexDirection="column" gap={2}>
                {cartItems.map((item) => (
                    <CartItemRow key={item.aasId} item={item} isMobile={isMobile}/>
                ))}
            </Box>
        );
    }

    return (
        <TableContainer component={Paper} data-testid="cart-item-list">
            <Table>
                <TableHead>
                    <TableRow>
                        <TableCell sx={tableHeaderText}>{t('productName')}</TableCell>
                        <TableCell sx={tableHeaderText}>{t('quantity')}</TableCell>
                        <TableCell sx={tableHeaderText}>{t('pricePerUnit')}</TableCell>
                        <TableCell sx={tableHeaderText}>{t('lineTotal')}</TableCell>
                        <TableCell sx={tableHeaderText} align="right">{t('remove')}</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {cartItems.map((item) => (
                        <CartItemRow key={item.aasId} item={item} isMobile={isMobile}/>
                    ))}
                </TableBody>
            </Table>
        </TableContainer>
    );
}
