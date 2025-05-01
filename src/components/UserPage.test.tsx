import '@testing-library/jest-dom'
import { render, screen, fireEvent } from '@testing-library/react'
import { describe, it, expect, beforeEach, vi } from 'vitest'
import { MemoryRouter } from 'react-router-dom'
import { UserAuthProvider } from '../context/userAuthContext'
import { CartProvider } from '../context/CartContext'
import React from 'react'
import UserPage from './UserPage'

vi.mock('../libs/firebase', () => ({
    auth: { currentUser: { reload: vi.fn() } },
    db: {},
}))

vi.mock('firebase/firestore', () => ({
    getFirestore: vi.fn(),
    doc: vi.fn(),
    getDoc: vi.fn(() =>
        Promise.resolve({
            exists: () => true,
            data: () => ({
                displayName: 'Mock Name',
                phone: '123',
                address: 'Mock Street',
            }),
        })
    ),
    updateDoc: vi.fn(),
    collection: vi.fn(),
    query: vi.fn(),
    where: vi.fn(),
    onSnapshot: vi.fn(() => () => { }),
}))

vi.mock('firebase/auth', () => ({
    getAuth: vi.fn(),
    onAuthStateChanged: vi.fn((_, cb) => {
        cb({
            uid: 'user123',
            email: 'test@example.com',
            displayName: 'Test User',
        })
        return () => { }
    }),
    updateProfile: vi.fn(() => Promise.resolve()),
}))

vi.mock('../context/userAuthContext', () => ({
    useUserAuth: () => ({
        user: {
            uid: 'user123',
            email: 'test@example.com',
            displayName: 'Test User',
            reload: vi.fn(),
        },
        setUser: vi.fn(),
    }),
    UserAuthProvider: ({ children }: { children: React.ReactNode }) => <>{children}</>,
}))
vi.mock('../context/CartContext', () => ({
    useCart: () => ({ items: [] }),
    CartProvider: ({ children }: { children: React.ReactNode }) => <>{children}</>,
}))

vi.mock('flowbite-react', () => ({
    Label: ({ children }: any) => <label>{children}</label>,
    TextInput: (props: any) => <input {...props} />,
    Button: ({ children, ...p }: any) => <button {...p}>{children}</button>,
    Alert: ({ children }: any) => <div role="alert">{children}</div>,
}))
vi.mock('react-icons/fa', () => ({
    FaPen: () => <span data-testid="icon-pen" />,
    FaHouseUser: () => <span data-testid="icon-house" />,
    FaUser: () => <span data-testid="icon-user" />,
    FaPhoneAlt: () => <span data-testid="icon-phone" />,
}))


describe('UserPage – Unit Test', () => {
    beforeEach(() => {
        vi.clearAllMocks()
    })

    it('renders profile info and toggles into edit mode', async () => {
        render(
            <MemoryRouter>
                <UserAuthProvider>
                    <CartProvider>
                        <UserPage />
                    </CartProvider>
                </UserAuthProvider>
            </MemoryRouter>
        )

        expect(await screen.findByText(/Mock Name/i)).toBeInTheDocument()
        expect(screen.getByText('123')).toBeInTheDocument()
        expect(screen.getByText(/Mock Street/i)).toBeInTheDocument()

        fireEvent.click(screen.getByRole('button', { name: /Edit Profile/i }))

        const inputs = await screen.findAllByRole('textbox')
        expect(inputs.length).toBeGreaterThanOrEqual(3)
    })
})