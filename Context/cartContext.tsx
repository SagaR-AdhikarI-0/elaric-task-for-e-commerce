import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { createContext, useContext, useEffect } from "react";
import { StyleSheet } from 'react-native';

interface CartItem {
    id: string;
    name: string;
    price: number;
    imageUrl: string;
    quantity: number;
    category?: string;
}
interface CartContextType {
    cart: CartItem[];
    addToCart: (item: CartItem) => void;
    removeFromCart: (itemId: string) => void;
    updateQuantity: (itemId: string, quantity: number) => void;
}

export const cartContext = createContext<CartContextType | undefined>(undefined);

const CART_STORAGE_KEY = '@cart_items';

const CartProvider = ({ children }: { children: React.ReactNode }) => {
    const [cart, setCart] = React.useState<CartItem[]>([]);

    // Load cart from AsyncStorage on mount
    useEffect(() => {
        loadCart();
    }, []);

    // Save cart to AsyncStorage whenever it changes
    useEffect(() => {
        saveCart();
    }, [cart]);

    const loadCart = async () => {
        try {
            const cartData = await AsyncStorage.getItem(CART_STORAGE_KEY);
            if (cartData) {
                setCart(JSON.parse(cartData));
            }
        } catch (error) {
            console.error('Error loading cart:', error);
        }
    };

    const saveCart = async () => {
        try {
            await AsyncStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cart));
        } catch (error) {
            console.error('Error saving cart:', error);
        }
    };

    const addToCart = (item: CartItem) => {
        const existingItem = cart.find(cartItem => cartItem.id === item.id);
        if (existingItem) {
            setCart(cart.map(cartItem =>
                cartItem.id === item.id
                    ? { ...cartItem, quantity: cartItem.quantity + item.quantity }
                    : cartItem
            ));
        } else {
            setCart([...cart, item]);
        }
    };

    const removeFromCart = (itemId: string) => {
        setCart(cart.filter(item => item.id !== itemId));
    };

    const updateQuantity = (itemId: string, quantity: number) => {
        if (quantity < 1) {
            removeFromCart(itemId);
            return;
        }
        setCart(cart.map(item =>
            item.id === itemId
                ? { ...item, quantity }
                : item
        ));
    };

    return (
        <cartContext.Provider value={{
            cart,
            addToCart,
            removeFromCart,
            updateQuantity,
        }}>
            {children}
        </cartContext.Provider>
    );
};

export const useCart = () => {
    const context = useContext(cartContext);
    return context;
};

export default CartProvider;

const styles = StyleSheet.create({});