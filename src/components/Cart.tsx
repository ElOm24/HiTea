import { Sidebar, Button } from "flowbite-react";
import { useShoppingCart } from "../context/CartContext";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { FaShoppingCart, FaMinusCircle, FaPlusCircle } from "react-icons/fa";

function Cart() {
    const {
        cartItems,
        clearCart,
        increaseQuantity,
        decreaseQuantity
    } = useShoppingCart();

    const [isOpen, setIsOpen] = useState(false);
    const navigate = useNavigate();
    const [animateIcon, setAnimateIcon] = useState(false);

    const totalItems = cartItems.reduce((sum, item) => sum + item.quantity, 0);

    const handleCheckout = () => {
        setIsOpen(false);
        navigate("/check-out");
    };

    useEffect(() => {
        if (cartItems.length > 0) {
            setAnimateIcon(true);
            const timeout = setTimeout(() => setAnimateIcon(false), 500);
            return () => clearTimeout(timeout);
        }
    }, [cartItems]);


    return (
        <>
            <div className="fixed bottom-6 right-6 z-50">
                <button
                    aria-label="Open Cart"
                    onClick={() => setIsOpen(true)}
                    className={`relative bg-[#80669d] text-white p-4 rounded-full shadow-lg hover:bg-[#a881af] transition ${animateIcon ? "animate-bounce" : ""}`}
                >
                    <FaShoppingCart size={24} />

                    {totalItems > 0 && (
                        <span className="absolute -top-1 -right-1 bg-yellow-400 text-black text-xs font-bold px-1.5 py-0.5 rounded-full">
                            {totalItems}
                        </span>
                    )}
                </button>
            </div>


            <Sidebar
                aria-label="Cart Sidebar"
                className={`fixed top-0 right-0 w-80 h-full z-50 transition-transform border-l shadow-xl ${isOpen ? "translate-x-0" : "translate-x-full"
                    }`}
            >
                <div className="p-4 h-full flex flex-col justify-between">
                    <div>
                        <div className="flex justify-between items-center mb-4">
                            <h2 className="text-xl font-semibold">Your Cart</h2>
                            <button
                                onClick={() => setIsOpen(false)}
                                className="text-red-600 font-bold text-lg"
                            >
                                ✕
                            </button>
                        </div>

                        {cartItems.length === 0 ? (
                            <p>Your cart is empty.</p>
                        ) : (
                            <ul className="space-y-2">
                                {cartItems.map((item, index) => (
                                    <li key={index} className="border p-2 rounded bg-gray-50">
                                        <div className="flex justify-between items-center">
                                            <p className="font-semibold">{item.name}</p>
                                            <div className="flex items-center gap-2">
                                                <button
                                                    aria-label={`Decrease quantity of ${item.name}`}
                                                    onClick={() => decreaseQuantity(item.id)}
                                                    className="p-1 text-red-500 hover:text-red-600 transition"
                                                >
                                                    <FaMinusCircle size={18} />
                                                </button>
                                                <span className="w-6 text-center">{item.quantity}</span>
                                                <button
                                                    aria-label={`Increase quantity of ${item.name}`}
                                                    onClick={() => increaseQuantity(item.id)}
                                                    className="p-1 text-green-500 hover:text-green-600 transition"
                                                >
                                                    <FaPlusCircle size={18} />
                                                </button>
                                            </div>
                                        </div>

                                        <p className="text-sm text-gray-500">Size: {item.size}</p>
                                        <p className="text-sm text-gray-500">Temp: {item.temperature}</p>
                                        <p className="text-sm text-gray-500">
                                            Toppings: {item.toppings.length > 0 ? item.toppings.join(", ") : "none"}
                                        </p>

                                        <p className="text-sm text-gray-600 mt-1">
                                            {item.quantity} x {item.price} = <strong>{item.quantity * item.price} ft</strong>
                                        </p>
                                    </li>
                                ))}
                            </ul>

                        )}
                    </div>

                    {cartItems.length > 0 && (
                        <div className="flex flex-col gap-2">
                            <Button
                                onClick={handleCheckout}
                                className="cart-button"
                            >
                                <span className="text-[#f4e9e1]">
                                    Checkout
                                </span>
                            </Button>
                            <Button
                                onClick={clearCart}
                                className="cart-button-clear"
                            >
                                <span className="text-[#f4e9e1]">
                                    Clear Cart
                                </span>
                            </Button>
                        </div>
                    )}
                </div>
            </Sidebar>
        </>
    );
}

export default Cart;