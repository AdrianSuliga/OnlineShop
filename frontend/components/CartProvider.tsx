import React, { createContext, useContext, useEffect, useState } from "react";

export interface CartItem {
  ProductID: number;
  Quantity: number;
}

const CartContext = createContext<{
  CartItems: CartItem[];
  addToCart: (item: CartItem) => void;
  removeFromCart: (itemID: number) => void;
  editCartItem: (itemID: number, newQuantity: number) => void;
  clearCart: () => void;
}>({
  CartItems: [],
  addToCart: () => {},
  removeFromCart: () => {},
  editCartItem: () => {},
  clearCart: () => {},
});

export const CartProvider = ({ children }: { children: React.ReactNode }) => {
  const [CartItems, setCartItems] = useState<CartItem[]>([]);

  useEffect(() => {
    setCartItems(JSON.parse(localStorage.getItem("cartItems") || "[]"));
  }, []);

  const addToCart = (item: CartItem) => {
    setCartItems((prev) => {
      let cartItems = [...prev];
      const index = cartItems.findIndex(
        (cartItem) => cartItem.ProductID === item.ProductID
      );

      if (index > -1) {
        cartItems[index] = {
          ...cartItems[index],
          Quantity: cartItems[index].Quantity + item.Quantity,
        };
      } else {
        cartItems = [...prev, item];
      }

      localStorage.setItem("cartItems", JSON.stringify(cartItems));
      return cartItems;
    });
  };

  const removeFromCart = (itemID: number) => {
    setCartItems((prev) => {
      let cartItems = [...prev];
      const index = cartItems.findIndex(
        (cartItem) => cartItem.ProductID === itemID
      );

      if (index > -1) {
        cartItems.splice(index, 1);
        localStorage.setItem("cartItems", JSON.stringify(cartItems));
      }

      return cartItems;
    });
  };

  const editCartItem = (itemID: number, newQuantity: number) => {
    setCartItems((prev) => {
      let cartItems = [...prev];
      const index = cartItems.findIndex(
        (cartItem) => cartItem.ProductID === itemID
      );

      if (index > -1) {
        cartItems[index] = {
          ...cartItems[index],
          Quantity: newQuantity,
        }
      } else {
        cartItems.push({
          ProductID: itemID,
          Quantity: newQuantity
        });
      }

      localStorage.setItem("cartItems", JSON.stringify(cartItems));
      return cartItems;
    });
  }

  const clearCart = () => {
    setCartItems(() => {
      localStorage.setItem("cartItems", JSON.stringify([]));
      return [];
    })
  };

  return (
    <CartContext.Provider
      value={{ CartItems, addToCart, removeFromCart, editCartItem, clearCart }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);
