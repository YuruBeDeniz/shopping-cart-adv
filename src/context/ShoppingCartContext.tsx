import { createContext, ReactNode, useContext, useState } from "react";

type ShoppingCartContextType =  {
    getItemQuantity: (id: number) => number
    increaseCartQuantity: (id: number) => void
    decreaseCartQuantity: (id: number) => void
    removeFromCart: (id: number) => void
}

type CartItemType = {
    id: number
    quantity: number
}

const ShoppingCartContext = createContext({} as ShoppingCartContextType);

export function useShoppingCart() {
    return useContext(ShoppingCartContext)
};

type ShoppingCartProviderProps = {
    children: ReactNode;
}

export function ShoppingCartProvider ( {children}: ShoppingCartProviderProps ) {
    const [cartItems, setCartItems] = useState<CartItemType[]>([]);

    function getItemQuantity (id: number) {
        return cartItems.find(item => item.id === id)?.quantity || 0;
    };

    function increaseCartQuantity (id: number) {
        setCartItems(currItems => {
            if(currItems.find(item => item.id === id) == null) {
                return [...currItems, { id, quantity: 1 }]
            } else {
                return currItems.map(item => {
                    if(item.id === id) {
                        return { ...item, quantity: item.quantity + 1};
                    } else {
                        return item;
                    }
                })
            }
        })
    };

    function decreaseCartQuantity (id: number) {
        setCartItems(currItems => {
            if(currItems.find(item => item.id === id)?.quantity === 1) {
                return currItems.filter(item => item.id !== id)
            } else {
                return currItems.map(item => {
                    if(item.id === id) {
                        return {...item, quantity: item.quantity -1}
                    } else {
                        return item;
                    }
                })
            }
        })
    };

    function removeFromCart (id: number) {
        setCartItems(currItems => {
            return currItems.filter(item => item.id !== id);
        })
    }

    return (
      <ShoppingCartContext.Provider 
        value={{
            getItemQuantity, 
            increaseCartQuantity, 
            decreaseCartQuantity,
            removeFromCart,
        }}>
          {children}
      </ShoppingCartContext.Provider> 
  )
};

//We will re-render out those children. The reason for this is because anytime
//you use a provider, the provider needs to have objects and chilren inside of it.
//so, we are just creating a wrapper around our context that has this children object.
//ReactNode is like the type you give to the children property inside of react