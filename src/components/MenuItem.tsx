import { Button, Card, Checkbox, Label, Modal, Radio } from "flowbite-react";
import { useUserAuth } from "../context/userAuthContext";
import { useNavigate } from "react-router-dom";
import { useShoppingCart } from "../context/CartContext";
import { useState } from "react";
import { FaPlus, FaMinus } from "react-icons/fa";


interface Props {
    firestoreId: string;
    id: string;
    preparationTime: number;
    ProductName: string;
    Price: number;
    description: string;
    isAdmin: boolean;
    onEdit: (item: any) => void;
    onDelete: () => void;
}

function MenuItem({
    firestoreId,
    id,
    ProductName,
    Price,
    description,
    preparationTime,
    isAdmin,
    onEdit,
    onDelete,
}: Props) {
    const localImagePath = `../assets/menu-img/${id}.png`;

    const { user } = useUserAuth();
    const navigate = useNavigate();
    const { addToCart } = useShoppingCart();

    const handleAddToCart = () => {
        if (!user) {
            navigate("/login");
            return;
        }

        addToCart({
            id,
            name: ProductName,
            firestoreId,
            price: Number(Price),
            quantity,
            size: selectedSize,
            temperature: selectedTemp,
            toppings: selectedToppings,
        });

        setOpenModal(false);
    };

    const handleToppingChange = (topping: string) => {
        setSelectedToppings(prev =>
            prev.includes(topping)
                ? prev.filter(t => t !== topping)
                : [...prev, topping]
        );
    };

    const [openModal, setOpenModal] = useState(false);
    type Size = "small" | "medium" | "large";
    type Temperature = "hot" | "no ice" | "with ice";
    const [quantity, setQuantity] = useState(1);

    const [selectedSize, setSelectedSize] = useState<Size>("medium");
    const [selectedTemp, setSelectedTemp] = useState<Temperature>("with ice");

    const [selectedToppings, setSelectedToppings] = useState<string[]>([]);
    const closeModal = () => {
        setQuantity(1);
        setOpenModal(false);
    };

    return (
        <div>
            <Card>
                <img
                    src={localImagePath}
                    alt={ProductName}
                    className="w-full h-[280px] object-contain rounded"
                    onError={(e) => {
                        (e.target as HTMLImageElement).src = "/assets/menu-img/default.png";
                    }}
                />
                <p><strong>Name:</strong> {ProductName}</p>
                <p><strong>Price:</strong> {Price}</p>
                <p>{description}</p>
                <Button className="my-button text-white" onClick={() => {
                    if (!user) {
                        navigate("/login");
                        return;
                    }
                    setOpenModal(true);
                }}>

                    <span className="text-[#f4e9e1]">
                        Order
                    </span>
                </Button>

                {isAdmin && (
                    <div className="flex justify-between mt-2">
                        <Button
                            color="warning"
                            onClick={() =>
                                onEdit({ firestoreId, id, ProductName, Price, description, preparationTime })
                            }
                        >
                            <span className="text-[#f4e9e1]">Edit</span>
                        </Button>
                        <Button color="failure" onClick={onDelete}>
                            <span className="text-[#f4e9e1]">Delete</span>
                        </Button>
                    </div>
                )}
            </Card>

            <Modal show={openModal} onClose={() => closeModal}>
                <Modal.Header> <span>Customize Your Drink</span> </Modal.Header>
                <Modal.Body className="flex flex-col gap-4">
                    <div>
                        <span className="font-semibold">Size:</span>
                        {["small", "medium", "large"].map(size => (
                            <Label key={size} className="flex items-center gap-2 text-[#362314]">
                                <Radio
                                    name="size"
                                    value={size}
                                    checked={selectedSize === size}
                                    onChange={() => setSelectedSize(size as Size)}
                                />
                                {size}
                            </Label>
                        ))}
                    </div>

                    <div>
                        <span className="font-semibold">Temperature:</span>
                        {["hot", "no ice", "with ice"].map(temp => (
                            <Label key={temp} className="flex items-center gap-2 text-[#362314]">
                                <Radio
                                    name="temperature"
                                    value={temp}
                                    checked={selectedTemp === temp}
                                    onChange={() => setSelectedTemp(temp as Temperature)}
                                />
                                {temp}
                            </Label>
                        ))}
                    </div>

                    <div>
                        <span className="font-semibold">Toppings:</span>
                        {["tapioca", "coffee jelly", "konjac", "coconut jelly"].map(topping => (
                            <Label key={topping} className="flex items-center gap-2 text-[#362314]">
                                <Checkbox
                                    value={topping}
                                    checked={selectedToppings.includes(topping)}
                                    onChange={() => handleToppingChange(topping)}
                                />
                                {topping}
                            </Label>
                        ))}
                    </div>
                    <div>
                        <span className="font-semibold">Quantity:</span>
                        <div className="flex items-center gap-4 mt-1">
                            <button
                                onClick={() => setQuantity(prev => Math.max(1, prev - 1))}
                                className="rounded-full bg-[#d4c4b3] p-2 hover:bg-[#b9a797] transition"
                            >
                                <FaMinus />
                            </button>
                            <span className="text-lg font-semibold">{quantity}</span>
                            <button
                                onClick={() => setQuantity(prev => prev + 1)}
                                className="rounded-full bg-[#d4c4b3] p-2 hover:bg-[#b9a797] transition"
                            >
                                <FaPlus />
                            </button>
                        </div>
                    </div>

                </Modal.Body>
                <Modal.Footer>
                    <Button className="my-pretty-button" onClick={handleAddToCart}>
                        <span className="text-[#f4e9e1]">Add to Cart</span>
                    </Button>
                    <Button className="my-button" onClick={() => setOpenModal(false)}>
                        <span className="text-[#f4e9e1]">Cancel</span>
                    </Button>
                </Modal.Footer>
            </Modal>
        </div >
    );
}

export default MenuItem;
