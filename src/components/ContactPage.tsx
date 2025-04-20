import { Alert, Button, Card, Label, Modal, Textarea } from "flowbite-react";
import { Tabs } from "flowbite-react";
import { useState, useEffect } from "react";
import { FaStar } from "react-icons/fa";
import { db } from "../libs/firebase";
import { addDoc, collection, getDocs, query, where } from "firebase/firestore";

function ContactPage() {
    const [openModal, setOpenModal] = useState(false);
    const [selectedLocation, setSelectedLocation] = useState("");
    const [selectedRating, setSelectedRating] = useState(0);
    const [hoveredRating, setHoveredRating] = useState(0);
    const [averageRatings, setAverageRatings] = useState<{ [key: string]: number }>({});
    const [reviewDescription, setReviewDescription] = useState("");
    const [showSuccessAlert, setShowSuccessAlert] = useState(false);


    const fetchRatings = async () => {
        const locations = ["Astoria", "Oktogon", "Buda"];
        const ratingsMap: { [key: string]: number } = {};

        for (const loc of locations) {
            const q = query(collection(db, "ratings"), where("location", "==", loc));
            const snapshot = await getDocs(q);
            const ratings = snapshot.docs.map(doc => doc.data().rating);
            const average = ratings.length ? (ratings.reduce((a, b) => a + b, 0) / ratings.length) : 0;
            ratingsMap[loc] = average;
        }

        setAverageRatings(ratingsMap);
    };


    useEffect(() => {
        fetchRatings();
    }, []);


    const handleRateClick = (location: string) => {
        setSelectedLocation(location);
        setSelectedRating(0);
        setOpenModal(true);
    };
    const handleSubmitRating = async () => {
        if (!selectedLocation || selectedRating === 0) return;

        try {
            await addDoc(collection(db, "ratings"), {
                location: selectedLocation,
                rating: selectedRating,
                reviewDescription,
                date: new Date().toISOString()
            });

            setOpenModal(false);
            setReviewDescription("");
            setSelectedRating(0);
            setHoveredRating(0);

            await fetchRatings();

            setShowSuccessAlert(true);
            setTimeout(() => setShowSuccessAlert(false), 4000);
        } catch (err) {
            console.error("Error submitting rating: ", err);
        }
    };


    const renderStars = (value: number, setter: (val: number) => void, hoverSetter?: (val: number) => void) => {
        return (
            <div className="flex gap-1">
                {[...Array(5)].map((_, i) => {
                    const ratingValue = i + 1;
                    return (
                        <button
                            key={i}
                            type="button"
                            onClick={() => setter(ratingValue)}
                            onMouseEnter={() => hoverSetter?.(ratingValue)}
                            onMouseLeave={() => hoverSetter?.(0)}
                        >
                            <FaStar
                                size={22}
                                className={
                                    (hoveredRating || value) >= ratingValue
                                        ? "text-yellow-400"
                                        : "text-gray-300"
                                }
                            />
                        </button>
                    );
                })}
            </div>
        );
    };

    return (
        <div className="main-background">
            {showSuccessAlert && (
                <div className="fixed top-4 left-1/2 transform -translate-x-1/2 z-50 w-[90%] max-w-md">
                    <Alert color="success" onDismiss={() => setShowSuccessAlert(false)}>
                        Thank you for your feedback! ⭐️
                    </Alert>
                </div>
            )}
            <header>Our Restaurants</header>
            <main className="w-2/5">
                <Tabs className="pt-5">
                    <Tabs.Item active title={<span>On Astoria</span>} >
                        <Card className="max-w-xl mx-auto my-tabs bg-[#f4e9e1]">
                            <img src="/astoria.png" />
                            <p><span className="font-semibold">Address:</span> Semmelwseis Utca 15</p>
                            <p><span className="font-semibold">Phone number:</span> +36204870289</p>
                            <div className="mb-2">
                                <span className="flex items-center gap-2">
                                    {[...Array(5)].map((_, i) => (
                                        <FaStar
                                            key={i}
                                            className={averageRatings["Astoria"] >= i + 1 ? "text-yellow-400" : "text-gray-300"}
                                        />
                                    ))}
                                    <span>({averageRatings["Astoria"]?.toFixed(1) || 0})</span>
                                </span>
                            </div>
                            <Button className="my-pretty-button" onClick={() => handleRateClick("Astoria")}>
                                <span className="text-[#f4e9e1]">Rate</span>
                            </Button>
                        </Card>
                    </Tabs.Item>

                    <Tabs.Item active title={<span>In Oktogon</span>} className="my-tabs">
                        <Card className="max-w-xl mx-auto my-tabs bg-[#f4e9e1]">
                            <img src="/oktogon.png" />
                            <p><span className="font-semibold">Address:</span> Chengery utca 15</p>
                            <p><span className="font-semibold">Phone number:</span> +36204870389 </p>
                            <div className="mb-2">
                                <span className="flex items-center gap-2">
                                    {[...Array(5)].map((_, i) => (
                                        <FaStar
                                            key={i}
                                            className={averageRatings["Oktogon"] >= i + 1 ? "text-yellow-400" : "text-gray-300"}
                                        />
                                    ))}
                                    <span>({averageRatings["Oktogon"]?.toFixed(1) || 0})</span>
                                </span>
                            </div>
                            <Button className="my-pretty-button" onClick={() => handleRateClick("Oktogon")}>
                                <span className="text-[#f4e9e1]">Rate</span>
                            </Button>
                        </Card>
                    </Tabs.Item>

                    <Tabs.Item active title={<span>On Buda Side</span>}  >
                        <Card className="max-w-xl mx-auto my-tabs bg-[#f4e9e1]">
                            <img src="/buda.png" />
                            <p><span className="font-semibold">Address:</span>  Istvan utca 15</p>
                            <p><span className="font-semibold">Phone number:</span> +36204870489 </p>
                            <div className="mb-2">
                                <span className="flex items-center gap-2">
                                    {[...Array(5)].map((_, i) => (
                                        <FaStar
                                            key={i}
                                            className={averageRatings["Buda"] >= i + 1 ? "text-yellow-400" : "text-gray-300"}
                                        />
                                    ))}
                                    <span>({averageRatings["Buda"]?.toFixed(1) || 0})</span>
                                </span>
                            </div>
                            <Button className="my-pretty-button" onClick={() => handleRateClick("Buda")}>
                                <span className="text-[#f4e9e1]">Rate</span>
                            </Button>
                        </Card>
                    </Tabs.Item>
                </Tabs>
            </main>

            <Modal show={openModal} onClose={() => setOpenModal(false)}>
                <Modal.Header> <span>Rate {selectedLocation} </span></Modal.Header>
                <Modal.Body>
                    <div className="flex flex-col items-center gap-4">
                        <Label className="text-lg"> <span>How was your experience?</span></Label>
                        {renderStars(selectedRating, setSelectedRating, setHoveredRating)}
                        <Textarea
                            placeholder="Write a short review..."
                            value={reviewDescription}
                            onChange={(e) => setReviewDescription(e.target.value)}
                            className="focus:outline-none focus:ring-0"
                        />
                        <Button onClick={handleSubmitRating} className="my-pretty-button mt-4"> <span className="text-[#f4e9e1]"> Submit Rating </span></Button>
                    </div>
                </Modal.Body>
            </Modal>
        </div>
    );
}

export default ContactPage;
