import { Label, TextInput, Button, Alert } from "flowbite-react";
import { updateProfile } from "firebase/auth";
import { useEffect, useState } from "react";
import { useUserAuth } from "../context/userAuthContext";
import { auth, db } from "../libs/firebase";
import { doc, updateDoc } from "firebase/firestore";
import { FaPen, FaHouseUser, FaUser, FaPhoneAlt } from "react-icons/fa";
import { collection, query, where, getDocs } from "firebase/firestore";

import { DocumentData } from "firebase/firestore";


function UserPage() {
    const { user, setUser } = useUserAuth();
    const [name, setName] = useState(user?.displayName || "");
    const [phone, setPhone] = useState("");
    const [address, setAddress] = useState("");


    const [showAlert, setShowAlert] = useState(false);
    const [isEditing, setIsEditing] = useState(false);

    const [orders, setOrders] = useState<DocumentData[]>([]);

    useEffect(() => {
        const fetchOrders = async () => {
            if (!user) return;

            const q = query(
                collection(db, "ordersHistory"),
                where("uid", "==", user.uid)
            );
            const snapshot = await getDocs(q);
            const fetchedOrders = snapshot.docs.map(doc => doc.data().items);
            setOrders(fetchedOrders);
        };

        fetchOrders();
    }, [user]);


    const handleProfileUpdate = async () => {
        if (!user) return;

        try {
            await updateProfile(user, { displayName: name });
            await auth.currentUser?.reload();

            const userRef = doc(db, "users", user.uid);
            await updateDoc(userRef, {
                displayName: name,
                phone,
                address,
            });

            const updatedUser = auth.currentUser;
            if (updatedUser) {
                setUser({ ...updatedUser });
                setName("");
                setPhone("");
                setAddress("");
                setShowAlert(true);
                setIsEditing(false);
            }

            console.log("Profile updated!");
        } catch (error) {
            console.error("Error updating profile:", error);
        }
    };

    useEffect(() => {
        const fetchOrders = async () => {
            if (!user) return;

            const q = query(collection(db, "ordersHistory"), where("uid", "==", user.uid));
            const snapshot = await getDocs(q);
            const fetchedOrders = snapshot.docs.map(doc => doc.data());
            setOrders(fetchedOrders);
        };

        fetchOrders();
    }, [user]);



    return (
        <main className="main-background min-h-screen p-4">
            <div className="max-w-5xl mx-auto">
                <header className="mb-6 text-center">Profile</header>

                {showAlert && (
                    <div className="fixed top-4 left-1/2 transform -translate-x-1/2 z-50 w-[90%] max-w-md">
                        <Alert color="success" onDismiss={() => setShowAlert(false)}>
                            <span className="font-medium">User data successfully updated!</span>
                        </Alert>
                    </div>
                )}

                <div className="flex flex-col md:flex-row gap-6">

                    <div className="flex-1">
                        {!isEditing ? (
                            <div className="p-6 bg-[#e4d4c8] rounded text-[#362314]shadow-md">
                                <p><span className="font-semibold">Email:</span> {user?.email}</p>
                                <p><span className="font-semibold">Name:</span> {user?.displayName ?? "No name set"}</p>
                                <p><span className="font-semibold">Phone number:</span> {phone || "No phone number set"}</p>
                                <p><span className="font-semibold">Delivery address:</span> {address || "No address set"}</p>
                                <Button onClick={() => setIsEditing(true)} className="my-pretty-button mt-4">
                                    <span className="flex items-center gap-2 text-[#f4e9e1]">
                                        Edit Profile <FaPen size={14} />
                                    </span>
                                </Button>
                            </div>
                        ) : (
                            <div className="p-6 bg-[#e4d4c8] rounded shadow-md text-[#362314] flex flex-col gap-4">
                                {/* Input fields */}
                                <div>
                                    <Label htmlFor="username">
                                        <span className="flex items-center gap-2 font-medium mb-2">
                                            <FaUser size={14} /> Name
                                        </span>
                                    </Label>
                                    <TextInput
                                        id="username"
                                        placeholder="Enter your name"
                                        value={name}
                                        onChange={(e) => setName(e.target.value)}
                                        required
                                    />
                                </div>

                                <div>
                                    <Label htmlFor="phone-number">
                                        <span className="flex items-center gap-2 font-medium mb-2">
                                            <FaPhoneAlt size={14} /> Phone number
                                        </span>
                                    </Label>
                                    <TextInput
                                        id="phone-number"
                                        placeholder="+36..."
                                        value={phone}
                                        onChange={(e) => setPhone(e.target.value)}
                                        required
                                    />
                                </div>

                                <div>
                                    <Label htmlFor="user-address">
                                        <span className="flex items-center gap-2 font-medium mb-2">
                                            <FaHouseUser size={14} /> Address
                                        </span>
                                    </Label>
                                    <TextInput
                                        id="user-address"
                                        placeholder="Some Street"
                                        value={address}
                                        onChange={(e) => setAddress(e.target.value)}
                                        required
                                    />
                                </div>

                                <div className="flex gap-2 mt-2">
                                    <Button onClick={handleProfileUpdate} className="my-pretty-button">
                                        <span className="text-[#f4e9e1]">Save Changes</span>
                                    </Button>
                                    <Button color="gray" onClick={() => setIsEditing(false)}>
                                        Cancel
                                    </Button>
                                </div>
                            </div>
                        )}
                    </div>

                    <aside className="w-full md:w-[300px] bg-[#e4d4c8] p-4 rounded text-[#362314] shadow-md h-[500px] flex flex-col">
                        <h3 className="text-lg font-semibold mb-4">Order History</h3>

                        {orders.length === 0 ? (
                            <p>You have no past orders.</p>
                        ) : (
                            <div className="overflow-y-auto flex-1 pr-1">
                                <ul className="flex flex-col gap-4">
                                    {orders.map((order: any, index: number) => (
                                        <li key={index} className="bg-[#f4e9e1] p-3 rounded shadow text-sm space-y-1">
                                            <p><span className="font-semibold">Date:</span> {new Date(order.orderDate?.seconds * 1000).toLocaleString()}</p>
                                            <p><span className="font-semibold">Items:</span> {order.items}</p>
                                            <p>
                                                <span className="font-semibold">Type:</span> {order.delivery ? "Delivery" : "Pickup"}
                                                {order.pickupLocation && ` @ ${order.pickupLocation}`}
                                            </p>
                                            {order.delivery && order.address && (
                                                <p><span className="font-semibold">Address:</span> {order.address}</p>
                                            )}
                                            <p><span className="font-semibold">Payment:</span> {order.card ? "Card" : order.cash ? "Cash" : "Unknown"}</p>
                                            <p><span className="font-semibold">Total:</span> {order.total} ft</p>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        )}
                    </aside>

                </div>
            </div>
        </main>

    );
}

export default UserPage;
