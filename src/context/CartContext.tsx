'use client';

import React, { createContext, ReactNode, useCallback, useContext, useState, useEffect } from 'react';

export type CartItem = {
  id: string;
  name: string;
  price: number;
  quantity: number;
  photo?: string;
};

export type FinalizeOrderParams = {
  customerName: string;
  customerPhone: string;
  orderType: 'delivery' | 'table' | 'takeaway';
  tableNumber?: string;
  address?: {
    street: string;
    number: string;
    neighborhood: string;
    complement?: string;
  };
  deliveryFee: number;
  paymentMethod: string;
  couponCode?: string;
  discountValue: number;
  subtotal: number;
  total: number;
};

type CartContextType = {
  cart: CartItem[];
  addToCart: (item: Omit<CartItem, 'quantity'>) => void;
  removeToCart: (item: { id: string }) => void;
  clearCart: () => void;
  finalizeOrder: (params: FinalizeOrderParams) => Promise<string>;
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

  const finalizeOrder = useCallback(async (params: FinalizeOrderParams): Promise<string> => {
    if (cart.length === 0) {
      throw new Error('O carrinho está vazio.');
    }

    const orderData = {
      ...params,
      items: cart.map(item => ({
        id: item.id,
        name: item.name,
        price: item.price,
        quantity: item.quantity,
        photo: item.photo
      }))
    };

    const response = await fetch('/api/orders', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(orderData)
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || 'Erro ao registrar o pedido.');
    }

    const data = await response.json();
    clearCart();
    return data.order.id;
  }, [cart, clearCart]);

  return (
    <CartContext.Provider value={{ cart, addToCart, removeToCart, clearCart, finalizeOrder }}>
      {children}
    </CartContext.Provider>
  );
};
