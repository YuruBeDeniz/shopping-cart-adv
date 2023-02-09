import { createContext, ReactNode, useContext, useState } from "react";
import ShoppingCard from "../components/ShoppingCart";
import { useLocalStorage } from "../hooks/UseLocalStorage";

type ShoppingCartContextType =  {
    openCart: () => void
    closeCart: () => void
    getItemQuantity: (id: number) => number
    increaseCartQuantity: (id: number) => void
    decreaseCartQuantity: (id: number) => void
    removeFromCart: (id: number) => void
    cartQuantity: number //this will show the quantity on the cart logo
    cartItems: CartItemType[] //this will show the cart items on the right side 
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
    const [isOpen, setIsOpen] = useState(false);
    const [cartItems, setCartItems] = useLocalStorage<CartItemType[]>("shopping-cart",[]);


    const openCart = () => setIsOpen(true);
    const closeCart = () => setIsOpen(false);
    const cartQuantity = cartItems.reduce((quantity, item) => (item.quantity + quantity), 0);

    function getItemQuantity (id: number) {
        return cartItems.find(item => item.id === id)?.quantity || 0;
    };

    function increaseCartQuantity (id: number) {
        setCartItems(currItems => {
            if(currItems.find(item => item.id === id) == null) {
                //if we can find an item inside of our cart, that means we have an item
                //so, we'll check if we dont have an item (== null); if our item doesnt already 
                //exist in the cart, we need to add it to our cart:
                return [...currItems, { id, quantity: 1 }]
            } else {
                //if the item exists, all we need to do is to increment the quantity by 1   
                return currItems.map(item => {
                    if(item.id === id) {
                        return { ...item, quantity: item.quantity + 1};
                    } else {
                        //otherwise, we'll return the item as it is, without any changes 
                        return item;
                    }
                })
            }
        })
    };

    function decreaseCartQuantity (id: number) {
        setCartItems(currItems => {
            if(currItems.find(item => item.id === id)?.quantity === 1) {
                //if the quantity is 1, we'll get rid of that item:
                console.log("filter check: ", currItems.filter(item => item.id !== id));
                return currItems.filter(item => item.id !== id);
                //this returns a brand new list of all our items;
                //all of them are goig to be exactly the same but whichever one we pass the id
                //(as a parameter in the function) of; we'll remove that from our list of items
                //yani parametre olarak girilen id'ye eşit olmayan id'ler filtrelenip return edilecek
                
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
            openCart,
            closeCart,
            cartItems,
            cartQuantity
        }}>
          {children}
          <ShoppingCard isOpen={isOpen} />
      </ShoppingCartContext.Provider> 
  )
};

//We will re-render out those children. The reason for this is because anytime
//you use a provider, the provider needs to have objects and chilren inside of it.
//so, we are just creating a wrapper around our context that has this children object.
//ReactNode is like the type you give to the children property inside of react