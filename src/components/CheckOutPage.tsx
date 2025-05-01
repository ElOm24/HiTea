import { useEffect, useState } from "react";
import { Label, TextInput, Button, Radio, Alert } from "flowbite-react";
import { useUserAuth } from "../context/userAuthContext";
import { useShoppingCart } from "../context/CartContext";
import { db } from "../libs/firebase";
import { addDoc, collection, doc, getDoc } from "firebase/firestore";
import { useNavigate } from "react-router-dom";

function CheckOutPage() {
    const { user } = useUserAuth();
    const { cartItems, clearCart } = useShoppingCart();

    const [errorMessage, setErrorMessage] = useState("");

    const navigate = useNavigate();

    const [address, setAddress] = useState("");

    const [paymentOption, setPaymentOption] = useState("card");
    const [pickupLocation, setPickupLocation] = useState("");
    const [total, setTotal] = useState(0);


    const [deliveryOption, setDeliveryOption] = useState<"delivery" | "pickup">("delivery");

    const [isDeliverySelected, setIsDeliverySelected] = useState(true);
    const [isPickUpSelected, setIsPickUpSelected] = useState(false);


    const [isCardPayment, setIsCardPayment] = useState(true);
    const [isCashPayment, setIsCashPayment] = useState(false);

    const [deliveryTime, setDeliveryTime] = useState(0);
    const calculatedTotal = cartItems.reduce(
        (sum, item) => sum + item.price * item.quantity,
        0
    );

    useEffect(() => {
        const calculateDeliveryTime = async () => {
            let totalTime = 0;

            for (const item of cartItems) {
                if (!item.firestoreId) continue;

                const docRef = doc(db, "menu", item.firestoreId);
                const docSnap = await getDoc(docRef);

                if (docSnap.exists()) {
                    const data = docSnap.data();
                    totalTime += (data.preparationTime || 0) * item.quantity;
                }
            }

            if (deliveryOption === "delivery") {
                totalTime += 15;
            }

            setDeliveryTime(totalTime);
        };

        if (cartItems.length > 0) {
            calculateDeliveryTime();
        }

        setTotal(calculatedTotal);
    }, [cartItems, deliveryOption]);


    const handlePlaceOrder = async () => {
        try {
            if (!user) {
                navigate("/login");
                return;
            }

            if (isPickUpSelected && !pickupLocation) {
                setErrorMessage("Please select a pickup location.");
                return;
            }

            const ordersRef = collection(db, "ordersHistory");
            const orderData = {
                uid: user.uid,
                email: user.email,
                name: user.displayName || "Unknown",
                delivery: isDeliverySelected,
                pickUp: isPickUpSelected,
                pickupLocation: isPickUpSelected ? pickupLocation || null : null,
                items: cartItems.map(item => ({
                    name: item.name,
                    size: item.size,
                    toppings: item.toppings,
                    temperature: item.temperature,
                    quantity: item.quantity,
                })),
                card: isCardPayment,
                cash: isCashPayment,
                orderDate: new Date(),
                total: calculatedTotal,
                address: isDeliverySelected ? address : null,
            };

            const orderRef = await addDoc(ordersRef, orderData);

            const now = Date.now();
            const endTime = now + deliveryTime * 60 * 1000;
            const timerData = {
                endTime,
                isDelivery: isDeliverySelected,
            };
            localStorage.setItem(
                `timer_${orderRef.id}`,
                JSON.stringify(timerData)
            );


            clearCart();
            navigate("/delivery-timer", {
                state: { justPlacedOrderId: orderRef.id },
            });


        } catch (error) {
            console.error("Error placing order:", error);
        }
    };

    return (
        <main className="main-background">
            <div className="fixed top-4 left-1/2 transform -translate-x-1/2 z-50 w-[90%] max-w-md">
                {errorMessage && (
                    <div>
                        <Alert color="failure" onDismiss={() => setErrorMessage("")}>
                            {errorMessage}
                        </Alert>
                    </div>
                )}
            </div>
            <div className="mx-auto max-w-md flex flex-col gap-4 bg-[#f4e9e1] p-6 rounded shadow-lg w-full mt-4 mb-4">
                <h1 className="text-center">Checkout</h1>

                <div>
                    <span className="mb-2 font-semibold">Your Order:</span>
                    <ul className="divide-y">
                        {cartItems.map((item, index) => (
                            <li key={index} className="py-2">
                                <div className="flex justify-between font-semibold">
                                    <span>{item.name} x {item.quantity}</span>
                                    <span>{item.price * item.quantity} ft</span>
                                </div>
                                <div className="text-sm text-gray-600 pl-1 mt-1 space-y-0.5">
                                    <p>Size: {item.size}</p>
                                    <p>Temperature: {item.temperature}</p>
                                    <p>Toppings: {item.toppings.length > 0 ? item.toppings.join(", ") : "none"}</p>
                                </div>
                            </li>
                        ))}
                    </ul>

                    <div className="mt-2 text-lg text-right">
                        <span>
                            Total: {total} ft
                        </span>
                    </div>
                </div>

                <div>
                    <div className="flex gap-4">
                        <Label>
                            <Radio
                                name="delivery"
                                checked={deliveryOption === "delivery"}
                                onChange={() => {
                                    setDeliveryOption("delivery");
                                    setIsDeliverySelected(true);
                                    setIsPickUpSelected(false);
                                }}
                            />
                            <span className="ml-1"> Delivery </span>
                        </Label>

                        <Label>
                            <Radio
                                name="pickup"
                                checked={deliveryOption === "pickup"}
                                onChange={() => {
                                    setDeliveryOption("pickup");
                                    setIsDeliverySelected(false);
                                    setIsPickUpSelected(true);
                                }}
                            />
                            <span className="ml-1"> Pick up </span>
                        </Label>
                    </div>

                    <div
                        className={`mt-3 overflow-hidden pl-4 ${deliveryOption === "delivery"
                            ? "max-h-40 opacity-100"
                            : "max-h-0 opacity-0 pointer-events-none"
                            }`}
                    >
                        <Label htmlFor="address">
                            <span className="flex items-center gap-2 text-[#362314] font-medium ml-2 mb-2 mt-2">
                                Delivery Address
                            </span>
                        </Label>
                        <TextInput
                            id="address"
                            value={address}
                            placeholder="Your address..."
                            onChange={(e) => setAddress(e.target.value)}
                            required
                        />
                    </div>

                    <div
                        className={`mt-3 overflow-hidden pl-4 ${deliveryOption === "pickup"
                            ? "max-h-40 opacity-100"
                            : "max-h-0 opacity-0 pointer-events-none"
                            }`}
                    >
                        <Label>
                            <span className="mt-2">Pickup Location</span>
                        </Label>
                        <div className="flex flex-col gap-1 mt-1">
                            {["Astoria", "Oktogon", "Buda"].map((loc) => (
                                <Label
                                    key={loc}
                                    className="flex items-center gap-2 text-[#362314]"
                                >
                                    <Radio
                                        name="pickup-location"
                                        checked={pickupLocation === loc}
                                        onChange={() => setPickupLocation(loc)}
                                    />
                                    {loc}
                                </Label>
                            ))}
                        </div>
                    </div>
                </div>

                <div>
                    <Label>
                        <span className="flex items-center gap-2 text-[#362314] font-medium ml-2 mb-2 mt-2">
                            Payment Method
                        </span>
                    </Label>
                    <Label>
                        <Radio
                            name="payment"
                            checked={isCardPayment}
                            onChange={() => {
                                setIsCardPayment(true);
                                setIsCashPayment(false);
                                setPaymentOption("card");
                            }}
                        />
                        <span className="ml-1"> Bank Transfer </span>
                    </Label>
                    <Label className="ml-4">
                        <Radio
                            name="payment"
                            checked={isCashPayment}
                            onChange={() => {
                                setIsCardPayment(false);
                                setIsCashPayment(true);
                                setPaymentOption("cash");
                            }}
                        />
                        <span className="ml-1"> Cash </span>
                    </Label>

                    {paymentOption === "card" && (
                        <div className="mt-4 pl-4 flex flex-col mb-2 text-[#362314]">
                            <Label> <span>Accout number for transfer:</span> </Label>
                            <p>1234567890</p>
                            <Label className="pt-2">
                                <span>
                                    Name:
                                </span>
                            </Label>
                            <p>HiTea Owner</p>
                            <Label className="pt-2">
                                <span>
                                    Address:
                                </span>
                            </Label>
                            <p>Budapest 1</p>
                        </div>
                    )}
                </div>

                <Button onClick={handlePlaceOrder} disabled={cartItems.length < 1} className="my-button">
                    <span className="text-[#f4e9e1]">
                        Place Order
                    </span>
                </Button>
            </div>
        </main >
    );
} export default CheckOutPage;
