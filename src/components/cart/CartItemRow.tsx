'use client';

import { Box, Card, CardContent, IconButton, TableCell, TableRow, TextField, Typography } from '@mui/material';
import { Add, Delete, Remove } from '@mui/icons-material';
import { useTranslations } from 'next-intl';
import { useCart } from 'components/contexts/CartContext';
import { CartItem } from 'lib/types/CartItem';
import { ImageWithFallback } from 'components/basics/StyledImageWithFallBack';

type CartItemRowProps = {
    readonly item: CartItem;
    readonly isMobile?: boolean;
};

const MAX_QUANTITY = 9999;

/**
 * Renders a single cart item row with product details, quantity controls, and remove button.
 * Displays product image, name, quantity input with increment/decrement buttons,
 * price per unit, line total, and a remove action.
 */
export function CartItemRow(props: CartItemRowProps) {
    const { item } = props;
    const t = useTranslations('pages.cart');
    const { updateQuantity, removeFromCart } = useCart();

    const pricePerUnit = item.pricePerUnit ?? 0;
    const lineTotal = pricePerUnit * item.quantity;
    const currency = item.currency ?? 'EUR';

    function formatPrice(price: number): string {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: currency,
        }).format(price);
    }

    function handleQuantityChange(event: React.ChangeEvent<HTMLInputElement>) {
        const value = parseInt(event.target.value, 10);
        if (!isNaN(value) && value >= 1 && value <= MAX_QUANTITY) {
            updateQuantity(item.aasId, value);
        }
    }

    function handleIncrement() {
        if (item.quantity < MAX_QUANTITY) {
            updateQuantity(item.aasId, item.quantity + 1);
        }
    }

    function handleDecrement() {
        if (item.quantity > 1) {
            updateQuantity(item.aasId, item.quantity - 1);
        } else {
            removeFromCart(item.aasId);
        }
    }

    function handleRemove() {
        removeFromCart(item.aasId);
    }

    if (props.isMobile) {
        return (
            <Card data-testid="cart-item-card">
                <CardContent>
                    <Box display="flex" gap={2}>
                        <Box sx={{ flexShrink: 0, width: 80, height: 80 }}>
                            <ImageWithFallback src={item.productImageUrl ?? ''} alt={item.productName} size={80} />
                        </Box>
                        <Box sx={{ flex: 1, minWidth: 0, overflow: 'hidden' }}>
                            <Box display="flex" justifyContent="space-between" alignItems="flex-start">
                                <Box sx={{ flex: 1, minWidth: 0, overflow: 'hidden' }}>
                                    <Typography
                                        variant="body1"
                                        fontWeight="medium"
                                        sx={{
                                            wordWrap: 'break-word',
                                            overflow: 'hidden',
                                            textOverflow: 'ellipsis',
                                            lineHeight: 1.4,
                                        }}
                                    >
                                        {item.productName}
                                    </Typography>
                                    {item.articleNumber && (
                                        <Typography
                                            variant="body2"
                                            color="text.secondary"
                                            sx={{
                                                mt: 0.5,
                                                wordWrap: 'break-word',
                                                overflow: 'hidden',
                                                textOverflow: 'ellipsis',
                                            }}
                                        >
                                            {item.articleNumber}
                                        </Typography>
                                    )}
                                    {item.manufacturerName && (
                                        <Typography
                                            variant="body2"
                                            color="text.secondary"
                                            sx={{
                                                mt: 0.5,
                                                wordWrap: 'break-word',
                                                overflow: 'hidden',
                                                textOverflow: 'ellipsis',
                                            }}
                                        >
                                            {item.manufacturerName}
                                        </Typography>
                                    )}
                                </Box>
                                <IconButton
                                    onClick={handleRemove}
                                    color="error"
                                    aria-label={t('removeAriaLabel', { productName: item.productName })}
                                    data-testid="cart-item-card-remove"
                                >
                                    <Delete />
                                </IconButton>
                            </Box>
                            <Box
                                mt={2}
                                display="flex"
                                justifyContent="space-between"
                                alignItems="center"
                                flexWrap="wrap"
                                gap={2}
                            >
                                <Box display="flex" alignItems="center" gap={1}>
                                    <IconButton
                                        size="small"
                                        onClick={handleDecrement}
                                        aria-label={t('decreaseQuantity')}
                                        data-testid="cart-item-card-decrement"
                                    >
                                        <Remove fontSize="small" />
                                    </IconButton>
                                    <TextField
                                        type="text"
                                        size="small"
                                        value={item.quantity}
                                        onChange={handleQuantityChange}
                                        slotProps={{
                                            htmlInput: {
                                                min: 1,
                                                max: MAX_QUANTITY,
                                                'aria-label': t('quantity'),
                                            },
                                        }}
                                        sx={{ width: 70 }}
                                        data-testid="cart-item-card-quantity"
                                    />
                                    <IconButton
                                        size="small"
                                        onClick={handleIncrement}
                                        disabled={item.quantity >= MAX_QUANTITY}
                                        aria-label={t('increaseQuantity')}
                                        data-testid="cart-item-card-increment"
                                    >
                                        <Add fontSize="small" />
                                    </IconButton>
                                </Box>
                                <Box textAlign="right">
                                    <Typography variant="body2" color="text.secondary">
                                        {formatPrice(pricePerUnit)} × {item.quantity}
                                    </Typography>
                                    <Typography variant="body1" fontWeight="medium">
                                        {formatPrice(lineTotal)}
                                    </Typography>
                                </Box>
                            </Box>
                        </Box>
                    </Box>
                </CardContent>
            </Card>
        );
    }

    return (
        <TableRow data-testid="cart-item-row">
            <TableCell>
                <Box display="flex" alignItems="center" gap={2}>
                    <Box sx={{ flexShrink: 0, width: 80, height: 80 }}>
                        <ImageWithFallback
                            src={item.productImageUrl ?? ''}
                            alt={item.productName}
                            size={80}
                        />
                    </Box>
                    <Box sx={{ flex: 1, minWidth: 0, overflow: 'hidden' }}>
                        <Typography
                            variant="body1"
                            fontWeight="medium"
                            sx={{
                                wordWrap: 'break-word',
                                overflow: 'hidden',
                                textOverflow: 'ellipsis',
                                lineHeight: 1.4
                            }}
                        >
                            {item.productName}
                        </Typography>
                        {item.articleNumber && (
                            <Typography
                                variant="body2"
                                color="text.secondary"
                                sx={{
                                    mt: 0.5,
                                    wordWrap: 'break-word',
                                    overflow: 'hidden',
                                    textOverflow: 'ellipsis'
                                }}
                            >
                                {item.articleNumber}
                            </Typography>
                        )}
                        {item.manufacturerName && (
                            <Typography
                                variant="body2"
                                color="text.secondary"
                                sx={{
                                    mt: 0.5,
                                    wordWrap: 'break-word',
                                    overflow: 'hidden',
                                    textOverflow: 'ellipsis'
                                }}
                            >
                                {item.manufacturerName}
                            </Typography>
                        )}
                    </Box>
                </Box>
            </TableCell>
            <TableCell>
                <Box display="flex" alignItems="center" gap={1}>
                    <IconButton
                        size="small"
                        onClick={handleDecrement}
                        aria-label={t('decreaseQuantity')}
                        data-testid="cart-item-decrement"
                    >
                        <Remove fontSize="small" />
                    </IconButton>
                    <TextField
                        type="text"
                        size="small"
                        value={item.quantity}
                        onChange={handleQuantityChange}
                        slotProps={{
                            htmlInput: {
                                min: 1,
                                max: MAX_QUANTITY,
                                'aria-label': t('quantity'),
                            },
                        }}
                        sx={{ width: 80 }}
                        data-testid="cart-item-quantity"
                    />
                    <IconButton
                        size="small"
                        onClick={handleIncrement}
                        disabled={item.quantity >= MAX_QUANTITY}
                        aria-label={t('increaseQuantity')}
                        data-testid="cart-item-increment"
                    >
                        <Add fontSize="small" />
                    </IconButton>
                </Box>
            </TableCell>
            <TableCell>
                <Typography variant="body2">
                    {formatPrice(pricePerUnit)}
                </Typography>
            </TableCell>
            <TableCell>
                <Typography variant="body2" fontWeight="medium">
                    {formatPrice(lineTotal)}
                </Typography>
            </TableCell>
            <TableCell align="right">
                <IconButton
                    onClick={handleRemove}
                    color="error"
                    aria-label={t('removeAriaLabel', { productName: item.productName })}
                    data-testid="cart-item-remove"
                >
                    <Delete />
                </IconButton>
            </TableCell>
        </TableRow>
    );
}
