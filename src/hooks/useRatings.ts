import { useState, useCallback } from 'react'
import {
    collection,
    query,
    where,
    getDocs,
    addDoc,
    QueryDocumentSnapshot,
    DocumentData,
} from 'firebase/firestore'
import { db } from '../libs/firebase'

export interface RatingDoc {
    id: string
    location: string
    userEmail: string
    userName: string
    rating: number
    reviewDescription: string
    date: string
}

export function useRatings() {
    const [averages, setAverages] = useState<Record<string, number>>({})
    const [reviewsList, setReviewsList] = useState<RatingDoc[]>([])

    const fetchAverages = useCallback(async (locations: string[]) => {
        const map: Record<string, number> = {}

        await Promise.all(
            locations.map(async loc => {
                const q = query(collection(db, 'ratings'), where('location', '==', loc))
                const snap = await getDocs(q)
                const vals = snap.docs.map(d => (d.data() as any).rating as number)
                map[loc] = vals.length
                    ? vals.reduce((a, b) => a + b, 0) / vals.length
                    : 0
            })
        )

        setAverages(map)
    }, [])

    const submitRating = useCallback(
        async (
            location: string,
            rating: number,
            reviewDescription: string,
            userEmail: string,
            userName: string
        ) => {
            await addDoc(collection(db, 'ratings'), {
                location,
                rating,
                reviewDescription,
                date: new Date().toISOString(),
                userEmail,
                userName,
            })
            await fetchAverages(Object.keys(averages))
        },
        [averages, fetchAverages]
    )

    const fetchReviews = useCallback(async (loc: string) => {
        const q = query(collection(db, 'ratings'), where('location', '==', loc))
        const snap = await getDocs(q)
        const docs: RatingDoc[] = snap.docs.map(
            (d: QueryDocumentSnapshot<DocumentData>) => {
                const data = d.data() as any
                return {
                    id: d.id,
                    location: loc,
                    userEmail: data.userEmail,
                    userName: data.userName,
                    rating: data.rating,
                    reviewDescription: data.reviewDescription,
                    date: data.date,
                }
            }
        )
        docs.sort(
            (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
        )
        setReviewsList(docs)
    }, [])

    return {
        averages,
        reviewsList,
        fetchAverages,
        submitRating,
        fetchReviews,
    }
}