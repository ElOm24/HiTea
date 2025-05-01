import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaClock } from "react-icons/fa";

export default function FloatingTimerButton() {
    const navigate = useNavigate();
    const [hasTimers, setHasTimers] = useState(false);

    const scan = () => {
        const keys = Object.keys(localStorage).filter((k) =>
            k.startsWith("timer_")
        );
        setHasTimers(keys.length > 0);
    };

    useEffect(scan, []);

    useEffect(() => {
        const onStorage = (e: StorageEvent) => {
            if (!e.key || e.key.startsWith("timer_")) {
                scan();
            }
        };
        window.addEventListener("storage", onStorage);
        return () => window.removeEventListener("storage", onStorage);
    }, []);

    if (!hasTimers) return null;

    return (
        <button
            onClick={() => navigate("/delivery-timer")}
            className=" fixed bottom-24 right-6 z-40 bg-yellow-500 text-white p-4 rounded-full shadow-lg hover:bg-yellow-600 transition animate-pulse"
            aria-label="View active timers"
        >
            <FaClock size={24} />
        </button>
    );
}