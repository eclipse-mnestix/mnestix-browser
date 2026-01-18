'use client';

import { Button, CircularProgress, Tooltip } from '@mui/material';
import AddShoppingCartIcon from '@mui/icons-material/AddShoppingCart';
import { useTranslations } from 'next-intl';
import { useState, useEffect } from 'react';
import { useCart } from 'components/contexts/CartContext';
import { AddToCartDialog } from 'components/cart/AddToCartDialog';
import { CartItem } from 'lib/types/CartItem';

type AddToCartButtonProps = {
    readonly aasId: string;
    readonly assetId: string;
    readonly productName: string;
    readonly manufacturerName?: string;
    readonly articleNumber?: string;
    readonly pricePerUnit?: number;
    readonly currency?: string;
    readonly productImageUrl?: string;
    readonly repositoryUrl?: string;
    readonly disabled?: boolean;
    readonly disabledReason?: string;
    readonly variant?: 'text' | 'outlined' | 'contained';
};

/**
 * Button component for adding a product to the shopping cart.
 * Shows a dialog after adding to let user choose to continue shopping or go to cart.
 */
export function AddToCartButton(props: AddToCartButtonProps) {
    const {
        aasId,
        assetId,
        productName,
        manufacturerName,
        articleNumber,
        pricePerUnit,
        currency,
        productImageUrl,
        repositoryUrl,
        disabled = false,
        disabledReason,
        variant = 'contained',
    } = props;

    const t = useTranslations('components');
    const { addToCart, isInCart } = useCart();
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [addedQuantity, setAddedQuantity] = useState(1);

    const alreadyInCart = isInCart(aasId);

    useEffect(() => {
        if (disabled && disabledReason) {
            console.warn('Add to Cart button disabled:', disabledReason, {
                aasId,
                assetId,
                productName,
            });
        }
    }, [disabled, disabledReason, aasId, assetId, productName]);

    function handleAddToCart() {
        setIsLoading(true);

        const cartItem: Omit<CartItem, 'quantity'> = {
            aasId,
            assetId,
            productName,
            manufacturerName,
            articleNumber,
            pricePerUnit,
            currency,
            productImageUrl,
            repositoryUrl,
        };

        addToCart(cartItem, 1);
        setAddedQuantity(1);
        setIsLoading(false);
        setIsDialogOpen(true);
    }

    function handleDialogClose() {
        setIsDialogOpen(false);
    }

    const buttonContent = (
        <Button
            variant={variant}
            color="primary"
            onClick={handleAddToCart}
            disabled={disabled || isLoading}
            startIcon={isLoading ? <CircularProgress size={20} /> : <AddShoppingCartIcon />}
            data-testid="add-to-cart-button"
            aria-label={`Add ${productName} to cart`}
        >
            {alreadyInCart ? t('addToCartButton.addMore') : t('addToCartButton.addToCart')}
        </Button>
    );

    return (
        <>
            {disabled && disabledReason ? (
                <Tooltip title={disabledReason} arrow>
                    {buttonContent}
                </Tooltip>
            ) : (
                buttonContent
            )}
            <AddToCartDialog
                open={isDialogOpen}
                onClose={handleDialogClose}
                productName={productName}
                quantity={addedQuantity}
            />
        </>
    );
}
