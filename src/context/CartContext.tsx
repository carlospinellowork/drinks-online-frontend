'use client';

import React, { createContext, ReactNode, useCallback, useContext, useState, useEffect } from 'react';

export type CartItem = {
  id: string;
  name: string;
  price: number;
  quantity: number;
  photo?: string;
};

type CartContextType = {
  cart: CartItem[];
  addToCart: (item: Omit<CartItem, 'quantity'>) => void;
  removeToCart: (item: { id: string }) => void;
  clearCart: () => void;
  finalizeOrder: (whatsappNumber: string, restaurantName: string, paymentMethod: string) => void;
};

const CartContext = createContext<CartContextType | undefined>(undefined);

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart deve ser usado dentro do CartProvider');
  }
  return context;
};

export const CartProvider = ({ children }: { children: ReactNode }) => {
  const [cart, setCart] = useState<CartItem[]>([]);

  // Load cart from localStorage on mount
  useEffect(() => {
    const savedCart = localStorage.getItem('restaurant_cart');
    if (savedCart) {
      try {
        setCart(JSON.parse(savedCart));
      } catch (e) {
        console.error('Failed to load cart from localStorage:', e);
      }
    }
  }, []);

  // Save cart to localStorage
  const saveCartToStorage = (newCart: CartItem[]) => {
    setCart(newCart);
    localStorage.setItem('restaurant_cart', JSON.stringify(newCart));
  };

  const addToCart = useCallback((item: Omit<CartItem, 'quantity'>) => {
    setCart(prevCart => {
      const isExistItem = prevCart.findIndex(cartItem => cartItem.id === item.id);
      let updatedCart: CartItem[] = [];

      if (isExistItem !== -1) {
        updatedCart = [...prevCart];
        updatedCart[isExistItem] = {
          ...updatedCart[isExistItem],
          quantity: updatedCart[isExistItem].quantity + 1
        };
      } else {
        updatedCart = [...prevCart, { ...item, quantity: 1 }];
      }

      localStorage.setItem('restaurant_cart', JSON.stringify(updatedCart));
      return updatedCart;
    });
  }, []);

  const removeToCart = useCallback((item: { id: string }) => {
    setCart(prevCart => {
      const isExistItem = prevCart.findIndex(cartItem => cartItem.id === item.id);
      if (isExistItem === -1) return prevCart;

      const updatedCart = [...prevCart];
      const updatedItem = { ...updatedCart[isExistItem] };

      updatedItem.quantity -= 1;

      if (updatedItem.quantity <= 0) {
        updatedCart.splice(isExistItem, 1);
      } else {
        updatedCart[isExistItem] = updatedItem;
      }

      localStorage.setItem('restaurant_cart', JSON.stringify(updatedCart));
      return updatedCart;
    });
  }, []);

  const clearCart = useCallback(() => {
    setCart([]);
    localStorage.removeItem('restaurant_cart');
  }, []);

  const finalizeOrder = useCallback((whatsappNumber: string, restaurantName: string, paymentMethod: string) => {
    if (cart.length === 0) return;

    // Build items text lines
    const itemsMessage = cart
      .map(item => `• ${item.quantity}x ${item.name} - R$ ${(item.price * item.quantity).toFixed(2).replace('.', ',')}`)
      .join('\n');

    const total = cart.reduce((acc, item) => acc + item.price * item.quantity, 0);
    
    // Create WhatsApp text message with clean formatting
    const welcome = `*Novo Pedido - ${restaurantName}*\n\n`;
    const details = `*Itens do Pedido:*\n${itemsMessage}\n\n`;
    const summary = `*Forma de Pagamento:* ${paymentMethod}\n`;
    const footer = `*Total:* R$ ${total.toFixed(2).replace('.', ',')}`;
    
    const rawText = `${welcome}${details}${summary}${footer}`;
    const encodedText = encodeURIComponent(rawText);
    
    // Clean up country code and format whatsapp link
    const cleanPhone = whatsappNumber.replace(/\D/g, '');
    const whatsappLink = `https://wa.me/${cleanPhone}?text=${encodedText}`;
    
    window.open(whatsappLink, '_blank');
    clearCart();
  }, [cart, clearCart]);

  return (
    <CartContext.Provider value={{ cart, addToCart, removeToCart, clearCart, finalizeOrder }}>
      {children}
    </CartContext.Provider>
  );
};
