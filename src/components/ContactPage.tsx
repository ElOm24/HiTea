// src/pages/ContactPage.tsx

import {
    Alert,
    Button,
    Card,
    Label,
    Modal,
    Textarea,
} from "flowbite-react";
import { Tabs } from "flowbite-react";
import { useState, useEffect } from "react";
import { FaStar } from "react-icons/fa";
import { useUserAuth } from "../context/userAuthContext";
import { db } from "../libs/firebase";
import {
    addDoc,
    collection,
    getDocs,
    query,
    where
} from "firebase/firestore";

interface RatingDoc {
    id: string;
    userEmail: string;
    userName: string;
    rating: number;
    reviewDescription: string;
    date: string;
}

function ContactPage() {
    const { user } = useUserAuth();

    // rating modal state
    const [openRatingModal, setOpenRatingModal] = useState(false);
    const [selectedLocation, setSelectedLocation] = useState("");
    const [selectedRating, setSelectedRating] = useState(0);
    const [hoveredRating, setHoveredRating] = useState(0);
    const [reviewDescription, setReviewDescription] = useState("");

    // reviews list modal state
    const [openReviewsModal, setOpenReviewsModal] = useState(false);
    const [reviewsList, setReviewsList] = useState<RatingDoc[]>([]);
    const [listLocation, setListLocation] = useState("");

    // success alert
    const [showSuccessAlert, setShowSuccessAlert] = useState(false);

    // average ratings per location
    const [averageRatings, setAverageRatings] = useState<{
        [loc: string]: number;
    }>({});

    // fetch average star per location
    const fetchAverages = async () => {
        const locs = ["Astoria", "Oktogon", "Buda"];
        const map: { [loc: string]: number } = {};
        for (const loc of locs) {
            const q = query(
                collection(db, "ratings"),
                where("location", "==", loc)
            );
            const snap = await getDocs(q);
            const vals = snap.docs.map((d) => (d.data() as any).rating as number);
            map[loc] = vals.length
                ? vals.reduce((a, b) => a + b, 0) / vals.length
                : 0;
        }
        setAverageRatings(map);
    };

    useEffect(() => {
        fetchAverages();
    }, []);

    // open rating modal
    const handleRateClick = (loc: string) => {
        setSelectedLocation(loc);
        setSelectedRating(0);
        setHoveredRating(0);
        setReviewDescription("");
        setOpenRatingModal(true);
    };

    // submit new rating
    const handleSubmitRating = async () => {
        if (!user || !selectedLocation || selectedRating === 0) return;
        try {
            await addDoc(collection(db, "ratings"), {
                location: selectedLocation,
                rating: selectedRating,
                reviewDescription,
                date: new Date().toISOString(),
                userEmail: user.email,
                userName: user.displayName || "Anonymous",
            });
            setOpenRatingModal(false);
            setShowSuccessAlert(true);
            await fetchAverages();
            setTimeout(() => setShowSuccessAlert(false), 4000);
        } catch (err) {
            console.error(err);
        }
    };

    // open reviews list modal
    const handleSeeReviews = async (loc: string) => {
        setListLocation(loc);
        setOpenReviewsModal(true);

        // fetch *all* reviews for this location
        const q = query(
            collection(db, "ratings"),
            where("location", "==", loc)
        );
        const snap = await getDocs(q);

        // map into our array
        const docs: RatingDoc[] = snap.docs.map((d) => {
            const data = d.data() as any;
            return {
                id: d.id,
                userEmail: data.userEmail,
                userName: data.userName,
                rating: data.rating,
                reviewDescription: data.reviewDescription,
                date: data.date,
            };
        });

        // sort newest-first by ISO date string
        docs.sort((a, b) => {
            return new Date(b.date).getTime() - new Date(a.date).getTime();
        });

        setReviewsList(docs);
    };

    // star-renderer
    const renderStars = (
        value: number,
        setter: (v: number) => void,
        hoverSetter?: (v: number) => void
    ) => (
        <div className="flex gap-1">
            {[1, 2, 3, 4, 5].map((val) => (
                <button
                    key={val}
                    type="button"
                    onClick={() => setter(val)}
                    onMouseEnter={() => hoverSetter?.(val)}
                    onMouseLeave={() => hoverSetter?.(0)}
                >
                    <FaStar
                        size={22}
                        className={
                            (hoveredRating || value) >= val
                                ? "text-yellow-400"
                                : "text-gray-300"
                        }
                    />
                </button>
            ))}
        </div>
    );

    return (
        <div className="main-background">
            {showSuccessAlert && (
                <div className="fixed top-4 left-1/2 transform -translate-x-1/2 z-50 w-[90%] max-w-md">
                    <Alert
                        color="success"
                        onDismiss={() => setShowSuccessAlert(false)}
                    >
                        Thanks for your feedback! ⭐️
                    </Alert>
                </div>
            )}

            <header className="text-center text-2xl my-4">Our Restaurants</header>
            <main className="w-2/5 mx-auto">
                <Tabs>
                    {[
                        {
                            loc: "Astoria",
                            img: "/astoria.png",
                            addr: "Semmelweis utca 15",
                            phone: "+36204870289",
                        },
                        {
                            loc: "Oktogon",
                            img: "/oktogon.png",
                            addr: "Chengery utca 15",
                            phone: "+36204870389",
                        },
                        {
                            loc: "Buda",
                            img: "/buda.png",
                            addr: "Istvan utca 15",
                            phone: "+36204870489",
                        },
                    ].map(({ loc, img, addr, phone }) => (
                        <Tabs.Item key={loc} title={<span>{loc}</span>}>

                            <Card className="max-w-xl mx-auto my-4 bg-[#f4e9e1]">
                                <img src={img} alt={loc} className="mb-2" />
                                <p>
                                    <span>Address:</span> {addr}
                                </p>
                                <p>
                                    <span>Phone:</span> {phone}
                                </p>
                                <div className="my-2 flex items-center gap-2">
                                    {Array.from({ length: 5 }, (_, i) => (
                                        <FaStar
                                            key={i}
                                            className={
                                                averageRatings[loc] >= i + 1
                                                    ? "text-yellow-400"
                                                    : "text-gray-300"
                                            }
                                        />
                                    ))}
                                    <span>({(averageRatings[loc] ?? 0).toFixed(1)})</span>

                                </div>
                                <div className="flex gap-4">
                                    <Button
                                        className="my-pretty-button"
                                        onClick={() => handleRateClick(loc)}
                                        disabled={!user}
                                    >

                                        <span className="text-[#f4e9e1]"> Leave a review </span>
                                    </Button>
                                    <Button
                                        color="link"
                                        type="button"
                                        onClick={() => handleSeeReviews(loc)}
                                        className="my-button self-center"

                                    >

                                        <span className="text-[#f4e9e1]"> See reviews </span>
                                    </Button>
                                </div>
                            </Card>
                        </Tabs.Item>
                    ))}
                </Tabs>
            </main>

            {/* Rating Modal */}
            <Modal
                show={openRatingModal}
                onClose={() => setOpenRatingModal(false)}
            >
                <Modal.Header>
                    <span>Rate {selectedLocation}</span>
                </Modal.Header>
                <Modal.Body>
                    <div className="flex flex-col items-center gap-4">
                        <Label>
                            <span>How was your experience at {selectedLocation}?</span>
                        </Label>
                        {renderStars(
                            selectedRating,
                            setSelectedRating,
                            setHoveredRating
                        )}
                        <Textarea
                            placeholder="Write a short review..."
                            value={reviewDescription}
                            onChange={(e) =>
                                setReviewDescription(e.target.value)
                            }
                            className="focus:outline-none focus:ring-0"
                        />
                    </div>
                </Modal.Body>
                <Modal.Footer>
                    <Button
                        className="my-pretty-button"
                        onClick={handleSubmitRating} disabled={selectedRating === 0}>
                        <span className="text-[#f4e9e1]"> Submit </span>
                    </Button>
                </Modal.Footer>
            </Modal>

            {/* Reviews List Modal */}
            <Modal
                show={openReviewsModal}
                onClose={() => setOpenReviewsModal(false)}
                size="xl"
            >
                <Modal.Header>
                    <span>Reviews for {listLocation}</span>
                </Modal.Header>

                {/* Move your max-h and overflow here */}
                <Modal.Body className="max-h-96 overflow-y-auto space-y-4 text-[#362314]">
                    {reviewsList.length === 0 ? (
                        <p>No reviews yet.</p>
                    ) : (
                        reviewsList.map((r) => (
                            <Card key={r.id} className="bg-white">
                                <p className="text-[#362314] font-semibold">{r.userName}</p>
                                <div className="flex items-center gap-1 my-1">
                                    {Array.from({ length: 5 }, (_, i) => (
                                        <FaStar
                                            key={i}
                                            className={
                                                i < r.rating ? "text-yellow-400" : "text-gray-300"
                                            }
                                        />
                                    ))}
                                </div>
                                <p>{r.reviewDescription}</p>
                                <p className="text-xs text-gray-500 mt-1">
                                    {new Date(r.date).toLocaleString()}
                                </p>
                            </Card>
                        ))
                    )}
                </Modal.Body>

                <Modal.Footer>
                    <Button
                        className="my-button"
                        onClick={() => setOpenReviewsModal(false)}
                    >
                        <span className="text-[#f4e9e1]">Close</span>
                    </Button>
                </Modal.Footer>
            </Modal>

        </div>
    );
} export default ContactPage;
