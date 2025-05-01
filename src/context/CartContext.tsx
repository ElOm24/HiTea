import { createContext, useContext, useEffect, useState } from "react";

type CartItem = {
    firestoreId: string;
    id: string;
    name: string;
    price: number;
    quantity: number;
    size: "small" | "medium" | "large";
    temperature: "hot" | "no ice" | "with ice";
    toppings: string[];
};

type CartContextType = {
    cartItems: CartItem[];
    addToCart: (item: CartItem) => void;
    clearCart: () => void;
    increaseQuantity: (id: string) => void;
    decreaseQuantity: (id: string) => void;
};

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: React.ReactNode }) {
    const [cartItems, setCartItems] = useState<CartItem[]>([]);

    useEffect(() => {
        const storedCart = localStorage.getItem("cart");
        if (storedCart) setCartItems(JSON.parse(storedCart));
    }, []);

    useEffect(() => {
        localStorage.setItem("cart", JSON.stringify(cartItems));
    }, [cartItems]);

    const addToCart = (item: CartItem) => {
        setCartItems(prev => {
            const existing = prev.find(i => i.id === item.id);
            if (existing) {
                return prev.map(i =>
                    i.id === item.id ? { ...i, quantity: i.quantity + item.quantity } : i
                );
            }
            return [...prev, item];
        });
    };

    const clearCart = () => setCartItems([]);

    const increaseQuantity = (id: string) => {
        setCartItems(prev =>
            prev.map(item =>
                item.id === id ? { ...item, quantity: item.quantity + 1 } : item
            )
        );
    };

    const decreaseQuantity = (id: string) => {
        setCartItems(prev =>
            prev
                .map(item =>
                    item.id === id ? { ...item, quantity: item.quantity - 1 } : item
                )
                .filter(item => item.quantity > 0)
        );
    };

    return (
        <CartContext.Provider value={{ cartItems, addToCart, clearCart, increaseQuantity, decreaseQuantity }}>
            {children}
        </CartContext.Provider>
    );
}

export function useShoppingCart() {
    const context = useContext(CartContext);
    if (!context) throw new Error("Must be used inside CartProvider");
    return context;
}