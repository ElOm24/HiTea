import { useEffect, useState } from 'react';
import { db } from '../libs/firebase';
import { collection, getDocs } from 'firebase/firestore';

export interface MenuItemData {
    id: string;
    ProductName: string;
    Price: number;
    description: string;
    imageLink: string;
}

export function GetMenuData() {
    const [menuItems, setMenuItems] = useState<MenuItemData[]>([]);

    useEffect(() => {
        const fetchMenuItems = async () => {
            const querySnapshot = await getDocs(collection(db, "menu"));
            const items = querySnapshot.docs.map(doc => doc.data() as MenuItemData);
            setMenuItems(items);
        };

        fetchMenuItems();
    }, [db]);

    return menuItems;
}