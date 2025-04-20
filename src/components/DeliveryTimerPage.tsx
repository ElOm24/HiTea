import { useLocation, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { Card } from "flowbite-react";

function DeliveryTimerPage() {
    const navigate = useNavigate();
    const location = useLocation();

    const deliveryTime = location.state?.deliveryTime || 15;
    const isDelivery = location.state?.delivery === true;

    const [timeLeft, setTimeLeft] = useState(0);
    const [timeUp, setTimeUp] = useState(false);

    useEffect(() => {
        if (!location.state && !localStorage.getItem("deliveryEndTime")) {
            navigate("/menu");
        }

        let endTime: number;

        if (localStorage.getItem("deliveryEndTime")) {
            endTime = parseInt(localStorage.getItem("deliveryEndTime") || "0");
        } else {
            const now = new Date().getTime();
            endTime = now + deliveryTime * 60 * 1000;
            localStorage.setItem("deliveryEndTime", endTime.toString());
        }

        const interval = setInterval(() => {
            const now = new Date().getTime();
            const difference = Math.max(Math.floor((endTime - now) / 1000), 0);

            if (difference <= 0) {
                clearInterval(interval);
                setTimeUp(true);
                localStorage.removeItem("deliveryEndTime");
            }

            setTimeLeft(difference);
        }, 1000);

        return () => clearInterval(interval);
    }, [location, navigate]);

    const minutes = Math.floor(timeLeft / 60);
    const seconds = timeLeft % 60;
    const formattedTime = `${minutes.toString().padStart(2, "0")}:${seconds
        .toString()
        .padStart(2, "0")}`;

    const handleClose = () => {
        localStorage.removeItem("deliveryEndTime");
        navigate("/menu");
    };

    return (
        <main className="main-background flex justify-center items-center min-h-screen">
            <Card className="w-[320px] text-center bg-yellow-100 animate-pulse shadow-lg relative">
                <button
                    onClick={handleClose}
                    className="absolute top-2 right-4 text-red-600 font-bold text-lg pb-2"
                >
                    ✕
                </button>

                {timeUp ? (
                    <>
                        <h2 className="text-xl font-semibold text-green-700 mt-4">
                            {isDelivery ? "Your order has arrived! 🎉" : "Your order is ready for pickup! 🧋"}
                        </h2>
                        <p className="text-sm text-gray-700">
                            {isDelivery ? "Delivered at" : "Prepared at"}: {new Date().toLocaleTimeString()}
                        </p>
                    </>
                ) : (
                    <>
                        <h2 className="text-xl font-semibold text-red-900 mb-2 mt-4">
                            {isDelivery ? "Your order is on the way!" : "Your order is being prepared!"}
                        </h2>
                        <div className="text-4xl font-bold text-red-900 tracking-widest">{formattedTime}</div>
                        <p className="text-sm mt-2 text-gray-700">Estimated time remaining</p>
                    </>
                )}
            </Card>
        </main>
    );
}

export default DeliveryTimerPage;
