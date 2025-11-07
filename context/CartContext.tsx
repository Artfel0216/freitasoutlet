"use client";

import React, { createContext, useContext, useState, ReactNode } from "react";

interface CartItem {
  id: string;
  title: string;
  price: number;
  image?: string;
  size?: number;
}

interface CartContextType {
  cart: CartItem[];
  addToCart: (item: CartItem) => void;
  removeFromCart: (id: string) => void;
  clearCart: () => void;
  cartCount: number; // ✅ Adicionado
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider = ({ children }: { children: ReactNode }) => {
  const [cart, setCart] = useState<CartItem[]>([]);

  const addToCart = (item: CartItem) => setCart((prev) => [...prev, item]);
  const removeFromCart = (id: string) =>
    setCart((prev) => prev.filter((item) => item.id !== id));
  const clearCart = () => setCart([]);

  const cartCount = cart.length; // ✅ Aqui o total de itens no carrinho

  return (
    <CartContext.Provider
      value={{ cart, addToCart, removeFromCart, clearCart, cartCount }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart deve ser usado dentro de um CartProvider");
  }
  return context;
};
