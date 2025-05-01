import { useState, useEffect, useCallback } from 'react'
import {
    collection,
    getDocs,
    addDoc,
    updateDoc,
    deleteDoc,
    doc,
    QueryDocumentSnapshot,
    DocumentData,
} from 'firebase/firestore'
import { db } from '../libs/firebase'

export interface MenuItem {
    firestoreId: string
    id: string
    ProductName: string
    Price: number
    description: string
}

export function useMenuData() {
    const [menuItems, setMenuItems] = useState<MenuItem[]>([])

    const fetchMenuItems = useCallback(async () => {
        const snaps = await getDocs(collection(db, 'menu'))
        const items = snaps.docs.map((d: QueryDocumentSnapshot<DocumentData>) => ({
            firestoreId: d.id,
            ...(d.data() as Omit<MenuItem, 'firestoreId'>),
        }))
        setMenuItems(items)
    }, [])

    useEffect(() => {
        fetchMenuItems()
    }, [fetchMenuItems])

    const addMenuItem = useCallback(
        async (item: Omit<MenuItem, 'firestoreId'>) => {
            await addDoc(collection(db, 'menu'), item)
            await fetchMenuItems()
        },
        [fetchMenuItems]
    )

    const updateMenuItem = useCallback(
        async (firestoreId: string, item: Omit<MenuItem, 'firestoreId'>) => {
            const ref = doc(db, 'menu', firestoreId)
            await updateDoc(ref, item)
            await fetchMenuItems()
        },
        [fetchMenuItems]
    )

    const deleteMenuItem = useCallback(
        async (firestoreId: string) => {
            const ref = doc(db, 'menu', firestoreId)
            await deleteDoc(ref)
            await fetchMenuItems()
        },
        [fetchMenuItems]
    )

    return {
        menuItems,
        addMenuItem,
        updateMenuItem,
        deleteMenuItem,
    }
}