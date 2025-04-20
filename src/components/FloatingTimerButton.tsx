import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaClock } from "react-icons/fa";

function FloatingTimerButton() {
    const navigate = useNavigate();
    const [showButton, setShowButton] = useState(false);

    useEffect(() => {
        const interval = setInterval(() => {
            const stored = localStorage.getItem("deliveryEndTime");
            if (!stored) {
                setShowButton(false);
                return;
            }

            const endTime = parseInt(stored);
            const now = new Date().getTime();
            const timeLeft = endTime - now;

            setShowButton(timeLeft > 0);
        }, 1000);

        return () => clearInterval(interval);
    }, []);

    if (!showButton) return null;

    return (
        <button
            onClick={() => navigate("/delivery-timer")}
            className="fixed bottom-24 right-6 z-50 w-14 h-14 flex items-center justify-center rounded-full bg-[#e0c49b] shadow-lg animate-pulse hover:scale-110 transition-transform"
            title="Return to timer"
        >
            <FaClock className="text-[#523a28] text-xl" />
        </button>

    );
}

export default FloatingTimerButton;
