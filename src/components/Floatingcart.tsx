import { Sidebar } from "flowbite-react";
import { useShoppingCart } from "../context/CartContext";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaShoppingCart } from "react-icons/fa";

function Floatingcart() {
    const { cartItems, clearCart } = useShoppingCart();
    const [isOpen, setIsOpen] = useState(false);
    const navigate = useNavigate();

    const handleCheckout = () => {
        setIsOpen(false);
        navigate("/checkout");
    };

    return (
        <div>
            <div className="fixed bottom-6 right-6 z-50">
                <button
                    onClick={() => setIsOpen(true)}
                    className="bg-red-600 text-white p-4 rounded-full shadow-lg hover:bg-red-700 transition"
                >
                    <FaShoppingCart size={24} />
                </button>
            </div>

            <Sidebar
                aria-label="Cart Sidebar"
                className={`fixed top-0 right-0 w-80 h-full z-50 transition-transform bg-white border-l shadow-xl ${isOpen ? "translate-x-0" : "translate-x-full"
                    }`}
            >
                <div className="p-4 h-full flex flex-col justify-between">
                    <div>
                        <div className="flex justify-between items-center mb-4">
                            <h2 className="text-xl font-bold">Your Cart</h2>
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
                                        <p className="font-semibold">{item.name}</p>
                                        <p className="text-sm text-gray-600">
                                            {item.quantity} x {item.price} ={" "}
                                            <strong>{item.quantity * item.price} ft</strong>
                                        </p>
                                    </li>
                                ))}
                            </ul>
                        )}
                    </div>

                    {cartItems.length > 0 && (
                        <div className="flex flex-col gap-2">
                            <button
                                onClick={handleCheckout}
                                className="bg-green-600 text-white p-2 rounded hover:bg-green-700"
                            >
                                Checkout
                            </button>
                            <button
                                onClick={clearCart}
                                className="bg-red-600 text-white p-2 rounded hover:bg-red-700"
                            >
                                Clear Cart
                            </button>
                        </div>
                    )}
                </div>
            </Sidebar>
        </div>
    );
}

export default Floatingcart;
