'use client';

import React, { createContext, PropsWithChildren, useContext, useState, useCallback } from 'react';
import { CartItem } from 'lib/types/CartItem';

type CartContextType = {
    cartItems: CartItem[];
    addToCart: (item: Omit<CartItem, 'quantity'>, quantity?: number) => void;
    removeFromCart: (aasId: string) => void;
    updateQuantity: (aasId: string, quantity: number) => void;
    clearCart: () => void;
    getCartItemCount: () => number;
    getTotalPrice: () => number;
    isInCart: (aasId: string) => boolean;
};

const CartContext = createContext<CartContextType | undefined>(undefined);

// TODO: Make MAX_QUANTITY configurable
const MAX_QUANTITY = 9999;

/**
 * Hook for accessing the cart context.
 * @throws Error if used outside CartContextProvider
 */
export function useCart() {
    const context = useContext(CartContext);
    if (!context) {
        throw new Error('useCart must be used within a CartContextProvider');
    }
    return context;
}

/**
 * Provider component for the shopping cart context.
 * Manages cart state and provides cart operations to child components.
 */
export function CartContextProvider(props: PropsWithChildren) {
    const [cartItems, setCartItems] = useState<CartItem[]>([]);

    const addToCart = useCallback((item: Omit<CartItem, 'quantity'>, quantity: number = 1) => {
        setCartItems((prevItems) => {
            const existingItem = prevItems.find((i) => i.aasId === item.aasId);
            if (existingItem) {
                const newQuantity = Math.min(existingItem.quantity + quantity, MAX_QUANTITY);
                return prevItems.map((i) =>
                    i.aasId === item.aasId ? { ...i, quantity: newQuantity } : i
                );
            }
            // Add new item with specified quantity
            return [...prevItems, { ...item, quantity: Math.min(quantity, MAX_QUANTITY) }];
        });
    }, []);

    const removeFromCart = useCallback((aasId: string) => {
        setCartItems((prevItems) => prevItems.filter((item) => item.aasId !== aasId));
    }, []);

    const updateQuantity = useCallback((aasId: string, quantity: number) => {
        if (quantity < 1) {
            removeFromCart(aasId);
            return;
        }
        const clampedQuantity = Math.min(quantity, MAX_QUANTITY);
        setCartItems((prevItems) =>
            prevItems.map((item) =>
                item.aasId === aasId ? { ...item, quantity: clampedQuantity } : item
            )
        );
    }, [removeFromCart]);

    const clearCart = useCallback(() => {
        setCartItems([]);
    }, []);

    const getCartItemCount = useCallback(() => {
        return cartItems.reduce((total, item) => total + item.quantity, 0);
    }, [cartItems]);

    const getTotalPrice = useCallback(() => {
        return cartItems.reduce((total, item) => {
            const price = item.pricePerUnit ?? 0;
            return total + price * item.quantity;
        }, 0);
    }, [cartItems]);

    const isInCart = useCallback((aasId: string) => {
        return cartItems.some((item) => item.aasId === aasId);
    }, [cartItems]);

    return (
        <CartContext.Provider
            value={{
                cartItems,
                addToCart,
                removeFromCart,
                updateQuantity,
                clearCart,
                getCartItemCount,
                getTotalPrice,
                isInCart,
            }}
        >
            {props.children}
        </CartContext.Provider>
    );
}
