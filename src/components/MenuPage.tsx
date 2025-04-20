import { useEffect, useState } from "react";
import { useUserAuth } from '../context/userAuthContext';
import {
  collection,
  addDoc,
  getDocs,
  deleteDoc,
  doc,
  updateDoc,
} from "firebase/firestore";
import { db } from "../libs/firebase";
import { Button, Label, TextInput } from "flowbite-react";
import Cart from "./Cart";
import MenuItem from "./MenuItem";
import FloatingTimerButton from "../components/FloatingTimerButton";

function MenuPage() {
  const { isAdmin } = useUserAuth();
  const [menuItems, setMenuItems] = useState<any[]>([]);
  const [showDialog, setShowDialog] = useState(false);
  const [editing, setEditing] = useState(false);

  const [newItem, setNewItem] = useState({
    firestoreId: "",
    id: "",
    ProductName: "",
    Price: "",
    description: "",
  });

  useEffect(() => {
    const fetchData = async () => {
      const querySnapshot = await getDocs(collection(db, "menu"));
      const items = querySnapshot.docs.map(doc => ({
        firestoreId: doc.id,
        ...doc.data(),
      }));
      setMenuItems(items);
    };
    fetchData();
  }, []);

  const handleAddItem = async () => {
    try {
      if (editing) {
        await updateDoc(doc(db, "menu", newItem.firestoreId), {
          id: newItem.id,
          ProductName: newItem.ProductName,
          Price: newItem.Price,
          description: newItem.description,
        });

        setMenuItems(prev =>
          prev.map(item =>
            item.firestoreId === newItem.firestoreId ? { ...item, ...newItem } : item
          )
        );
      } else {
        const docRef = await addDoc(collection(db, "menu"), {
          id: newItem.id,
          ProductName: newItem.ProductName,
          Price: newItem.Price,
          description: newItem.description,
        });

        setMenuItems(prev => [
          ...prev,
          { ...newItem, firestoreId: docRef.id }
        ]);
      }

      setShowDialog(false);
      setNewItem({ firestoreId: "", id: "", ProductName: "", Price: "", description: "" });
      setEditing(false);
    } catch (error) {
      console.error("Error adding/updating item: ", error);
    }
  };

  const handleEdit = (item: any) => {
    setNewItem(item);
    setEditing(true);
    setShowDialog(true);
  };

  const handleDelete = async (firestoreId: string) => {
    try {
      await deleteDoc(doc(db, "menu", firestoreId));
      setMenuItems(prev => prev.filter(item => item.firestoreId !== firestoreId));
    } catch (error) {
      console.error("Error deleting item: ", error);
    }
  };

  return (
    <div className="main-background">
      <header className="flex justify-center"> {isAdmin ? "View: Admin" : "Menu"} </header>

      {isAdmin && (
        <div className="flex justify-center mt-6">
          <Button
            onClick={() => {
              setShowDialog(true);
              setEditing(false);
              setNewItem({ firestoreId: "", id: "", ProductName: "", Price: "", description: "" });
            }}
            className="my-button"> <span className="text-[#f4e9e1]">Add Bubble Tea</span>
          </Button>
        </div>
      )}

      {showDialog && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center z-50">
          <div className="bg-[#e4d4c8] p-6 rounded-md w-[400px] shadow-lg">
            <h2 className="text-lg font-semibold mb-4 self-center text-[#523a28]">{editing ? "Edit" : "Add"} Bubble Tea</h2>
            <Label className="p-2 text-[#523a28]">Image id</Label>
            <TextInput
              placeholder="Image ID (e.g., 1, 2)"
              className="p-2 w-full mb-2 text-[#523a28]"
              value={newItem.id}
              onChange={(e) => setNewItem({ ...newItem, id: e.target.value })}
            />

            <Label className="p-2 text-[#523a28]">Product name</Label>
            <TextInput
              placeholder="Product name"
              className="p-2 w-full mb-2 text-[#523a28]"
              value={newItem.ProductName}
              onChange={(e) => setNewItem({ ...newItem, ProductName: e.target.value })}
            />

            <Label className="p-2 text-[#523a28]">Price</Label>
            <TextInput
              placeholder="Price"
              className="p-2 w-full mb-2"
              value={newItem.Price}
              onChange={(e) => setNewItem({ ...newItem, Price: e.target.value })}
            />

            <Label className="p-2 text-[#523a28]">Description</Label>
            <TextInput id="large" sizing="lg"
              placeholder="Description"
              className="p-2 w-full mb-4"
              value={newItem.description}
              onChange={(e) => setNewItem({ ...newItem, description: e.target.value })}
            />

            <div className="flex justify-end gap-2">
              <Button
                onClick={() => setShowDialog(false)}
                className="my-button"
              >
                Cancel
              </Button>
              <Button
                onClick={handleAddItem}
                className="my-button"
              >
                {editing ? "Save Changes" : "Add"}
              </Button>
            </div>
          </div>
        </div>
      )}

      <main className='mb-[45px]'>
        <div className="container mx-auto px-4 mt-8 flex flex-wrap gap-4 justify-center">
          {menuItems.map((item) => (
            <div className="max-w-sm" key={item.firestoreId}>
              <MenuItem
                {...item}
                isAdmin={isAdmin}
                onEdit={handleEdit}
                onDelete={() => handleDelete(item.firestoreId)}
              />
            </div>
          ))}
        </div>

        <Cart />
        <FloatingTimerButton />
      </main>
    </div>
  );
}

export default MenuPage;
