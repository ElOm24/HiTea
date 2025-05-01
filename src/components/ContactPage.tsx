import { useState, useEffect } from 'react'
import {
    Alert,
    Button,
    Card,
    Label,
    Modal,
    Textarea,
    Tabs,
} from 'flowbite-react'
import { FaStar } from 'react-icons/fa'
import { useUserAuth } from '../context/userAuthContext'
import { useRatings } from '../hooks/useRatings'

const locationsData = [
    {
        loc: 'Astoria',
        img: '/astoria.png',
        addr: 'Semmelweis utca 15',
        phone: '+36 20 487 0289',
    },
    {
        loc: 'Oktogon',
        img: '/oktogon.png',
        addr: 'Chengery utca 15',
        phone: '+36 20 487 0389',
    },
    {
        loc: 'Buda',
        img: '/buda.png',
        addr: 'István utca 15',
        phone: '+36 20 487 0489',
    },
]

export default function ContactPage() {
    const { user } = useUserAuth()
    const { averages, reviewsList, fetchAverages, submitRating, fetchReviews } =
        useRatings()

    const [openRating, setOpenRating] = useState(false)
    const [openReviews, setOpenReviews] = useState(false)
    const [selLoc, setSelLoc] = useState('')
    const [selRating, setSelRating] = useState(0)
    const [hoverRating, setHoverRating] = useState(0)
    const [desc, setDesc] = useState('')
    const [showSuccess, setShowSuccess] = useState(false)

    useEffect(() => {
        fetchAverages(locationsData.map(d => d.loc))
    }, [fetchAverages])

    const renderStars = (
        value: number,
        onClick: (v: number) => void,
        onHover?: (v: number) => void
    ) => (
        <div className="flex gap-1">
            {[1, 2, 3, 4, 5].map(val => (
                <button
                    key={val}
                    onClick={() => onClick(val)}
                    onMouseEnter={() => onHover?.(val)}
                    onMouseLeave={() => onHover?.(0)}
                >
                    <FaStar
                        size={22}
                        className={
                            (hoverRating || value) >= val ? 'text-yellow-400' : 'text-gray-300'
                        }
                    />
                </button>
            ))}
        </div>
    )

    const startRating = (loc: string) => {
        setSelLoc(loc)
        setSelRating(0)
        setHoverRating(0)
        setDesc('')
        setOpenRating(true)
    }

    const handleSubmit = async () => {
        if (!user || selRating === 0) return
        await submitRating(
            selLoc,
            selRating,
            desc,
            user.email!,
            user.displayName || 'Anonymous'
        )
        setOpenRating(false)
        setShowSuccess(true)
        setTimeout(() => setShowSuccess(false), 4000)
    }

    const handleSee = async (loc: string) => {
        setSelLoc(loc)
        await fetchReviews(loc)
        setOpenReviews(true)
    }

    return (
        <div className="main-background">
            {showSuccess && (
                <div className="fixed top-4 left-1/2 transform -translate-x-1/2 z-50">
                    <Alert color="success" onDismiss={() => setShowSuccess(false)}>
                        Thanks for your feedback! ⭐️
                    </Alert>
                </div>
            )}

            <h1 className="text-center text-2xl font-semibold">Our Restaurants</h1>
            <main className="w-full sm:w-4/5 md:w-3/5 lg:w-2/5 mx-auto px-4">
                <Tabs className="mt-3">
                    {locationsData.map(({ loc, img, addr, phone }) => (
                        <Tabs.Item key={loc} title={<span>{loc}</span>}>
                            <Card className="max-w-xl mx-auto my-4 bg-[#f4e9e1] text-[#362314]">
                                <img src={img} alt={loc} className="" />
                                <p>
                                    <span>Address:</span> {addr}
                                </p>
                                <p>
                                    <span>Phone:</span> {phone}
                                </p>

                                <div className="my-2 flex items-center gap-2">
                                    {renderStars(averages[loc] ?? 0, () => { }, () => { })}
                                    <span>({(averages[loc] ?? 0).toFixed(1)})</span>
                                </div>

                                <div className="flex gap-4">
                                    <Button
                                        onClick={() => startRating(loc)}
                                        disabled={!user}
                                        className="my-pretty-button"
                                    >
                                        <span className="text-[#f4e9e1]"> Leave a review</span>
                                    </Button>
                                    <Button
                                        color="link"
                                        onClick={() => handleSee(loc)}
                                        className="my-button"
                                    >
                                        <span className="text-[#f4e9e1]">See reviews</span>
                                    </Button>
                                </div>
                            </Card>
                        </Tabs.Item>
                    ))}
                </Tabs>
            </main>

            <Modal show={openRating} onClose={() => setOpenRating(false)}>
                <Modal.Header> <span>Rate {selLoc}</span></Modal.Header>
                <Modal.Body>
                    <div className='flex flex-col items-center gap-4'>
                        <Label> <span className="text-[#362314]">How was your experience at {selLoc}?</span></Label>
                        {renderStars(selRating, setSelRating, setHoverRating)}
                        <Textarea
                            placeholder="Write a short review…"
                            value={desc}
                            onChange={e => setDesc(e.target.value)}
                        />
                    </div>
                </Modal.Body>
                <Modal.Footer>
                    <Button
                        className='my-pretty-button'
                        onClick={handleSubmit} disabled={selRating === 0}>
                        <span className='text-[#f4e9e1]'>Submit</span>
                    </Button>
                </Modal.Footer>
            </Modal>

            <Modal show={openReviews} onClose={() => setOpenReviews(false)} size="xl">
                <Modal.Header> <span>Reviews for {selLoc}</span></Modal.Header>
                <Modal.Body>
                    {reviewsList.length === 0 ? (
                        <p>No reviews yet.</p>
                    ) : (
                        reviewsList.map(r => (
                            <Card key={r.id} className="mb-4">
                                <p className="font-semibold">{r.userName}</p>
                                <div className="flex gap-1 my-1">
                                    {renderStars(r.rating, () => { })}
                                </div>
                                <p>{r.reviewDescription}</p>
                                <p className="text-xs text-gray-500">
                                    {new Date(r.date).toLocaleString()}
                                </p>
                            </Card>
                        ))
                    )}
                </Modal.Body>
                <Modal.Footer>
                    <Button
                        className='my-button'
                        onClick={() => setOpenReviews(false)}>
                        <span className="text-[#f4e9e1]">Close</span>
                    </Button>
                </Modal.Footer>
            </Modal>
        </div>
    )
}
