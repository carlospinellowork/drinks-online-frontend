import { createContext, ReactNode, useCallback, useContext, useState } from 'react'

type CartItem = {
  id: string
  name: string
  price: number
  quantity: number
  photo?: string
}

type CartContextType = {
  cart: CartItem[]
  addToCart: (item: CartItem) => void
  removeToCart: (item: CartItem) => void
  finalizeOrder: () => void
}

const CartContext = createContext<CartContextType | undefined>(undefined)

export const useCart = () => {
  const context = useContext(CartContext)

  if (!context) {
    throw new Error("useCart deve ser usado dentro do CartProvider")
  }

  return context
}

export const CartProvider = ({ children }: { children: ReactNode }) => {
  const [cart, setCart] = useState<CartItem[]>([])

  const addToCart = useCallback((item: CartItem) => {
    setCart(prevCart => {
      const isExistItem = prevCart.findIndex(cartItem => cartItem.id === item.id)

      if (isExistItem !== -1) {
        const updatedCart = [...prevCart]
        updatedCart[isExistItem] = {
          ...updatedCart[isExistItem],
          quantity: updatedCart[isExistItem].quantity + 1
        }
        return updatedCart
      } else {
        return [...prevCart, { ...item, quantity: 1 }]
      }
    })
  }, [setCart])

  const removeToCart = (item: CartItem) => {
    setCart(prevCart => {
      const isExistItem = prevCart.findIndex(cartItem => cartItem.id === item.id);

      if (isExistItem !== -1) {
        const updatedCart = [...prevCart];
        const updatedItem = { ...updatedCart[isExistItem] };

        updatedItem.quantity -= 1;

        if (updatedItem.quantity <= 0) {
          updatedCart.splice(isExistItem, 1);
        } else {
          updatedCart[isExistItem] = updatedItem;
        }

        return updatedCart;
      }

      return prevCart;
    });
  };


  const finalizeOrder = () => {
    const whatsappMessage = cart
      .map(item => `${item.quantity}x ${item.name} - R$ ${item.price * item.quantity}`)
      .join('%0D%0A');
    const total = cart.reduce((acc, item) => acc + item.price * item.quantity, 0);
    const whatsappLink = `https://wa.me/5511957944402?text=Bem%20vindo%20ao%20Faustino%20Drinks%0D%0AItens:%0D%0A${whatsappMessage}%0D%0ATotal: R$ ${total.toFixed(2)}`;
    window.open(whatsappLink, '_blank');
  }

  return (
    <CartContext.Provider
      value={{ cart, addToCart, removeToCart, finalizeOrder }}
    >
      {children}
    </CartContext.Provider>
  )
}