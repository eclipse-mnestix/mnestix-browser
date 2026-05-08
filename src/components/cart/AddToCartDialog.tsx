'use client';

import {
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle,
    Box,
    Typography,
} from '@mui/material';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import { useTranslations } from 'next-intl';
import { useRouter } from 'next/navigation';

type AddToCartDialogProps = {
    /** Whether the dialog is open. */
    readonly open: boolean;
    /** Callback to close the dialog. */
    readonly onClose: () => void;
    /** Name of the product that was added to the cart. */
    readonly productName: string;
    /** Quantity that was added to the cart. */
    readonly quantity: number;
};

/**
 * Dialog shown after a product is added to the cart.
 * Allows the user to choose between staying on the product page or navigating to the cart.
 */
export function AddToCartDialog(props: AddToCartDialogProps) {
    const { open, onClose, productName, quantity } = props;
    const t = useTranslations('components');
    const router = useRouter();

    /** Close the dialog and keep the user on the current page (continue shopping). */
    function handleContinueShopping() {
        onClose();
    }

    /** Close the dialog and navigate the user to the cart page. */
    function handleGoToCart() {
        onClose();
        router.push('/cart');
    }

    return (
        <Dialog
            open={open}
            onClose={onClose}
            aria-labelledby="add-to-cart-dialog-title"
            aria-describedby="add-to-cart-dialog-description"
            data-testid="add-to-cart-dialog"
        >
            <DialogTitle id="add-to-cart-dialog-title">
                <Box display="flex" alignItems="center" gap={1}>
                    <CheckCircleOutlineIcon color="success" />
                    <Typography variant="h6" component="span">
                        {t('addToCartDialog.title')}
                    </Typography>
                </Box>
            </DialogTitle>
            <DialogContent>
                <DialogContentText id="add-to-cart-dialog-description">
                    {t('addToCartDialog.message', { productName, quantity })}
                </DialogContentText>
            </DialogContent>
            <DialogActions sx={{ padding: 2, gap: 1 }}>
                <Button
                    onClick={handleContinueShopping}
                    variant="outlined"
                    data-testid="continue-shopping-button"
                >
                    {t('addToCartDialog.continueShopping')}
                </Button>
                <Button
                    onClick={handleGoToCart}
                    variant="contained"
                    color="primary"
                    autoFocus
                    data-testid="go-to-cart-button"
                >
                    {t('addToCartDialog.goToCart')}
                </Button>
            </DialogActions>
        </Dialog>
    );
}
