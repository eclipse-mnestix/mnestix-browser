'use client';

import { Button, CircularProgress, Tooltip } from '@mui/material';
import AddShoppingCartIcon from '@mui/icons-material/AddShoppingCart';
import { useTranslations } from 'next-intl';
import { useState, useEffect } from 'react';
import { useCart } from 'components/contexts/CartContext';
import { AddToCartDialog } from 'components/cart/AddToCartDialog';
import { CartItem } from 'lib/types/CartItem';

type AddToCartButtonProps = {
    /** The id of the AAS (asset administration shell) used as unique identifier for cart operations. */
    readonly aasId: string;
    /** The id of the asset variant or physical asset. */
    readonly assetId: string;
    /** Display name of the product shown in the UI and used in accessibility labels. */
    readonly productName: string;
    /** Optional manufacturer name shown in product listings. */
    readonly manufacturerName?: string;
    /** Optional article number / SKU of the product. */
    readonly articleNumber?: string;
    /** Optional price per unit used for cart calculations. */
    readonly pricePerUnit?: number;
    /** Currency code for price formatting (e.g. 'EUR'). */
    readonly currency?: string;
    /** Optional URL of the product image used in cart previews. */
    readonly productImageUrl?: string;
    /** Optional repository URL where the product originates. */
    readonly repositoryUrl?: string;
    /** If true the add-to-cart button will be disabled. */
    readonly disabled?: boolean;
    /** Optional reason text shown when the button is disabled (as a tooltip). */
    readonly disabledReason?: string;
    /** MUI button variant to use for the control. */
    readonly variant?: 'text' | 'outlined' | 'contained';
};

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

    /** Add the current product to the cart and open the confirmation dialog.
     * This sets a loading state while performing the add action and then
     * shows the `AddToCartDialog` allowing the user to continue shopping or go to the cart.
     */
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

    /** Close the add-to-cart confirmation dialog. */
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
