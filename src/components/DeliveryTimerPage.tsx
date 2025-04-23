import { useLocation, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { Card } from "flowbite-react";

interface LocationState {
    justPlacedOrderId?: string;
}

type Timer = {
    orderId: string;
    endTime: number;
    timeLeft: number;
    timeUp: boolean;
    isDelivery: boolean;
};

function DeliveryTimerPage() {
    const navigate = useNavigate();
    const location = useLocation();
    const state = (location.state ?? {}) as LocationState;

    const [timers, setTimers] = useState<Timer[]>([]);

    useEffect(() => {
        const storedKeys = Object.keys(localStorage).filter((k) =>
            k.startsWith("timer_")
        );

        if (!state.justPlacedOrderId && storedKeys.length === 0) {
            navigate("/menu");
            return;
        }

        const initial: Timer[] = storedKeys.map((key) => {
            const orderId = key.replace("timer_", "");
            const data = JSON.parse(localStorage.getItem(key)!);
            return {
                orderId,
                endTime: data.endTime as number,
                timeLeft: Math.max(
                    Math.floor((data.endTime - Date.now()) / 1000),
                    0
                ),
                timeUp: false,
                isDelivery: data.isDelivery as boolean,
            };
        });
        setTimers(initial);

        const interval = setInterval(() => {
            setTimers((prev) =>
                prev.map((t) => {
                    const diff = Math.max(
                        Math.floor((t.endTime - Date.now()) / 1000),
                        0
                    );
                    if (diff === 0 && !t.timeUp) {
                        localStorage.removeItem(`timer_${t.orderId}`);
                    }
                    return {
                        ...t,
                        timeLeft: diff,
                        timeUp: diff === 0,
                    };
                })
            );
        }, 1000);

        return () => clearInterval(interval);
    }, [state.justPlacedOrderId, navigate]);

    if (timers.length === 0) return null;

    return (
        <main className="main-background flex flex-wrap justify-center gap-4 p-4">
            {timers.map(({ orderId, timeLeft, timeUp, isDelivery }) => {
                const minutes = Math.floor(timeLeft / 60)
                    .toString()
                    .padStart(2, "0");
                const seconds = (timeLeft % 60).toString().padStart(2, "0");
                const formattedTime = `${minutes}:${seconds}`;

                const handleClose = () => {
                    setTimers((ts) =>
                        ts.filter((t) => t.orderId !== orderId)
                    );
                    localStorage.removeItem(`timer_${orderId}`);
                    if (timeUp) navigate("/menu");
                };

                return (
                    <Card
                        key={orderId}
                        className="w-72 text-center bg-[#e4d4c8] shadow-lg relative"
                    >
                        <button
                            onClick={handleClose}
                            className="absolute top-2 right-4 text-red-600 font-bold text-lg"
                        >
                            ✕
                        </button>

                        {timeUp ? (
                            <>
                                <h2 className="text-xl font-semibold text-[#523a28] mt-4">
                                    {isDelivery
                                        ? <span>"Your order has arrived!"</span>
                                        : "Your order is ready for pickup!"}
                                </h2>

                                <p className="text-sm text-gray-700">
                                    {isDelivery ? "Delivered at" : "Prepared at"}:{" "}
                                    {new Date().toLocaleTimeString()}
                                </p>
                            </>
                        ) : (
                            <>
                                <h2 className="text-xl font-semibold text-[#523a28] mb-2 mt-4">
                                    {isDelivery
                                        ? "Your order is on the way!"
                                        : "Your order is being prepared!"}
                                </h2>

                                <div className="text-4xl font-bold text-[#523a28] tracking-widest">
                                    {formattedTime}
                                </div>
                                <p className="text-sm mt-2 text-[#523a28]">
                                    Estimated time remaining
                                </p>
                            </>
                        )}

                        <p className="mt-2 font-semibold text-[#523a28]">
                            Order ID: {orderId}
                        </p>
                    </Card>
                );
            })}
        </main>
    );
} export default DeliveryTimerPage;