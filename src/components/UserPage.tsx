// src/pages/UserPage.tsx

import { Label, TextInput, Button, Alert } from "flowbite-react";
import { updateProfile } from "firebase/auth";
import { useEffect, useState } from "react";
import { useUserAuth } from "../context/userAuthContext";
import { auth, db } from "../libs/firebase";
import {
    doc,
    getDoc,
    updateDoc,
    collection,
    query,
    where,
    onSnapshot,
} from "firebase/firestore";
import { FaPen, FaHouseUser, FaUser, FaPhoneAlt } from "react-icons/fa";

interface OrderItem {
    name: string;
    size?: string;
    toppings?: string[];
    temperature?: string;
    quantity: number;
}

interface Order {
    id: string;
    orderDate: { seconds: number };
    items: OrderItem[];
    delivery: boolean;
    pickupLocation?: string;
    address?: string;
    card: boolean;
    cash: boolean;
    total: number;
}

function UserPage() {
    const { user, setUser } = useUserAuth();
    const [name, setName] = useState("");
    const [phone, setPhone] = useState("");
    const [address, setAddress] = useState("");
    const [showAlert, setShowAlert] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [orders, setOrders] = useState<Order[]>([]);

    useEffect(() => {
        if (!user) return;

        // Load profile from Firestore
        (async () => {
            const userRef = doc(db, "users", user.uid);
            const snap = await getDoc(userRef);
            if (snap.exists()) {
                const data = snap.data() as {
                    displayName?: string;
                    phone?: string;
                    address?: string;
                };
                if (data.displayName) setName(data.displayName);
                if (data.phone) setPhone(data.phone);
                if (data.address) setAddress(data.address);
            } else if (user.displayName) {
                setName(user.displayName);
            }
        })();

        // Subscribe to orders in real time
        const q = query(
            collection(db, "ordersHistory"),
            where("uid", "==", user.uid)
        );
        const unsub = onSnapshot(q, (snap) => {
            console.log("ordersHistory snapshot IDs:", snap.docs.map(d => d.id));
            const live: Order[] = snap.docs.map((d) => {
                const ddata = d.data() as any;
                return {
                    id: d.id,
                    orderDate: ddata.orderDate,
                    items: Array.isArray(ddata.items) ? ddata.items : [],
                    delivery: !!ddata.delivery,
                    pickupLocation: ddata.pickupLocation,
                    address: ddata.address,
                    card: !!ddata.card,
                    cash: !!ddata.cash,
                    total: ddata.total,
                };
            });
            live.sort((a, b) => b.orderDate.seconds - a.orderDate.seconds);
            setOrders(live);

        });

        return () => unsub();
    }, [user]);

    // This is now actually used in the JSX below
    const handleProfileUpdate = async () => {
        if (!user) return;
        try {
            // 1) Auth profile
            await updateProfile(user, { displayName: name });
            await auth.currentUser?.reload();
            // 2) Firestore profile
            const userRef = doc(db, "users", user.uid);
            await updateDoc(userRef, { displayName: name, phone, address });
            // 3) Refresh context and UI
            setUser(auth.currentUser!);
            setShowAlert(true);
            setIsEditing(false);
        } catch (err) {
            console.error("Error updating profile:", err);
        }
    };

    return (
        <main className="main-background min-h-screen p-4">
            <div className="max-w-5xl mx-auto">
                <header className="mb-6 text-center text-2xl font-semibold">
                    Profile
                </header>

                {showAlert && (
                    <div className="fixed top-4 left-1/2 transform -translate-x-1/2 z-50 w-[90%] max-w-md">
                        <Alert color="success" onDismiss={() => setShowAlert(false)}>
                            <span className="font-medium">
                                User data successfully updated!
                            </span>
                        </Alert>
                    </div>
                )}

                <div className="flex flex-col md:flex-row gap-6">
                    {/* PROFILE PANEL */}
                    <div className="flex-1">
                        {!isEditing ? (
                            <div className="p-6 bg-[#e4d4c8] rounded shadow-md text-[#362314] space-y-2">
                                <p>
                                    <strong>Email:</strong> {user?.email}
                                </p>
                                <p>
                                    <strong>Name:</strong> {name || "No name set"}
                                </p>
                                <p>
                                    <strong>Phone number:</strong>{" "}
                                    {phone || "No phone number set"}
                                </p>
                                <p>
                                    <strong>Delivery address:</strong>{" "}
                                    {address || "No address set"}
                                </p>
                                <Button
                                    onClick={() => setIsEditing(true)}
                                    className="my-pretty-button mt-4"
                                >
                                    <FaPen className="mr-2 text-[#f4e9e1]" size={14} /> <span className="text-[#f4e9e1]">Edit Profile</span>
                                </Button>
                            </div>
                        ) : (
                            <div className="p-6 bg-[#e4d4c8] rounded shadow-md text-[#362314] flex flex-col gap-4">
                                <div>
                                    <Label htmlFor="username">
                                        <div className="flex items-center gap-2 font-medium mb-2">
                                            <FaUser size={14} /> Name
                                        </div>
                                    </Label>
                                    <TextInput
                                        id="username"
                                        value={name}
                                        onChange={(e) => setName(e.target.value)}
                                        required
                                    />
                                </div>

                                <div>
                                    <Label htmlFor="phone-number">
                                        <div className="flex items-center gap-2 font-medium mb-2">
                                            <FaPhoneAlt size={14} /> Phone number
                                        </div>
                                    </Label>
                                    <TextInput
                                        id="phone-number"
                                        value={phone}
                                        onChange={(e) => setPhone(e.target.value)}
                                    />
                                </div>

                                <div>
                                    <Label htmlFor="user-address">
                                        <div className="flex items-center gap-2 font-medium mb-2">
                                            <FaHouseUser size={14} /> Address
                                        </div>
                                    </Label>
                                    <TextInput
                                        id="user-address"
                                        value={address}
                                        onChange={(e) => setAddress(e.target.value)}
                                    />
                                </div>

                                <div className="flex gap-2">
                                    <Button
                                        onClick={handleProfileUpdate}
                                        className="my-pretty-button"
                                    >
                                        <span className="text-[#f4e9e1]">Save Changes</span>

                                    </Button>
                                    <Button color="gray" onClick={() => setIsEditing(false)}>
                                        Cancel
                                    </Button>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* ORDER HISTORY */}
                    <aside className="w-full md:w-[360px] bg-[#e4d4c8] p-4 rounded shadow-md text-[#362314] h-[600px] flex flex-col">
                        <h3 className="text-lg font-semibold mb-4">Order History</h3>
                        {orders.length === 0 ? (
                            <p>You have no past orders.</p>
                        ) : (
                            <div className="overflow-y-auto flex-1 pr-1 space-y-4">
                                {orders.map((order) => (
                                    <div
                                        key={order.id}
                                        className="bg-[#f4e9e1] p-3 rounded shadow text-sm space-y-1"
                                    >
                                        <p>
                                            <strong>Order ID:</strong> {order.id}
                                        </p>
                                        <p>
                                            <strong>Date:</strong>{" "}
                                            {new Date(
                                                order.orderDate.seconds * 1000
                                            ).toLocaleString()}
                                        </p>
                                        <p>
                                            <strong>Items:</strong>{" "}
                                            {order.items
                                                .map((it) => `${it.name} x${it.quantity}`)
                                                .join(", ")}
                                        </p>
                                        <p>
                                            <strong>Type:</strong>{" "}
                                            {order.delivery ? "Delivery" : "Pickup"}
                                            {order.pickupLocation && ` @ ${order.pickupLocation}`}
                                        </p>
                                        {order.delivery && order.address && (
                                            <p>
                                                <strong>Address:</strong> {order.address}
                                            </p>
                                        )}
                                        <p>
                                            <strong>Total:</strong> {order.total} ft
                                        </p>
                                        <p>
                                            <strong>Payment:</strong>{" "}
                                            {order.card
                                                ? "Bank Transfer"
                                                : order.cash
                                                    ? "Cash"
                                                    : "Unknown"}
                                        </p>
                                    </div>
                                ))}
                            </div>
                        )}
                    </aside>
                </div>
            </div>
        </main>
    );
} export default UserPage;
