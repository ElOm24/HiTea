import { Button, Card } from "flowbite-react";
import { useUserAuth } from "../context/userAuthContext";
import { useNavigate } from "react-router-dom";
import { useShoppingCart } from "../context/CartContext";

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

    const handleOrder = () => {
        if (!user) {
            navigate("/login");
            return;
        }

        addToCart({
            id,
            name: ProductName,
            firestoreId,
            price: Number(Price),
            quantity: 1,
        });
    };

    return (
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
            <Button className="my-button text-white" onClick={handleOrder}>
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
    );
}

export default MenuItem;
