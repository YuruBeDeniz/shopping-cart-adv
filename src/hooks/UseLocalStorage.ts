//to make all the items stay in cart, when we refresh our page 
//we need this custom hook where we use it in our context
//instead of useState
//this hook needs to work with custom generic types (<CartItemType[]>) we created as well as the different 
//props (("shopping-cart",[])) in our context

//this <T> type of T is just whatever we
//pass here for out useLocalStorage hook: useLocalStorage<CartItemType[]>
//so it's an array of cart items
//whatever type it is this initial value is either going to be that type or
////(() => T ) this function parameter that returns that type

//after defining the parameters, we need to implement our useState logic
//inside useState we want to use the function version of type T as we
//only ever want to invoke, checking our local storage one time as it is a slow operation to do
//and we dont want to do this everytime our component re-renders

import { useEffect, useState } from "react";

export function useLocalStorage<T>(key: string, initialValue: T | (() => T )) {
  const [value, setValue] = useState<T>(() => {
    const jsonValue = localStorage.getItem(key);
    if(jsonValue != null) return JSON.parse(jsonValue);

    //if we dont have jsonValue:
    if(typeof initialValue === "function"){
        //if it is a function, we need to invoke it as a function
        return (initialValue as () => T)();
    } else {
        return initialValue;
    }
  });

  useEffect(() => {
    localStorage.setItem(key, JSON.stringify(value)); 
  }, [key, value]);

  return [value, setValue] as [typeof value, typeof setValue]
};

//all this function essentially does is it gets the value from local storage
//or it's going to get the initial value we passed in
//then we set up a useEffect that runs every single time our key or our value changes
//we just want to store our value back in local storage so we can do a setItem 
//
