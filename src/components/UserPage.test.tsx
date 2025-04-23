
import React from 'react'
import { describe, it, expect, beforeEach, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import '@testing-library/jest-dom'
import { MemoryRouter } from 'react-router-dom'

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

import { UserAuthProvider } from '../context/userAuthContext'
import { CartProvider } from '../context/CartContext'
import UserPage from './UserPage'

describe('UserPage – Functional Test', () => {
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



/*
// src/components/UserPage.test.tsx
import React from 'react'
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { render, screen, fireEvent, cleanup } from '@testing-library/react'
import '@testing-library/jest-dom'
import { BrowserRouter } from 'react-router-dom'

// ─── 0️⃣ MOCK YOUR FIREBASE INIT ─────────────────────────────────────────────
vi.mock('../libs/firebase', () => ({
    auth: { currentUser: { reload: vi.fn() } },
    db: {},
}))

// ─── 1️⃣ MOCK FIRESTORE ───────────────────────────────────────────────────────
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
    onSnapshot: vi.fn((_, cb) => {
        cb({ docs: [] })
        return () => { }
    }),
}))

// ─── 2️⃣ MOCK AUTH ────────────────────────────────────────────────────────────
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

// ─── 3️⃣ STUB CONTEXT PROVIDERS ───────────────────────────────────────────────
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

// ─── 4️⃣ MOCK FLOWBITE & ICONS ────────────────────────────────────────────────
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

// ─── 5️⃣ IMPORT YOUR COMPONENT UNDER TEST ────────────────────────────────────
import UserPage from './UserPage'

describe('UserPage – Functional Test', () => {
    beforeEach(() => {
        vi.clearAllMocks()
    })

    afterEach(() => {
        cleanup()
    })

    it('renders profile info (from getDoc) and toggles edit mode', async () => {
        render(
            <BrowserRouter>
                <UserPage />
            </BrowserRouter>
        )

        // 1) Firestore getDoc effect populates name/phone/address
        expect(await screen.findByText(/Email:/i)).toBeInTheDocument()
        expect(screen.getByText(/Mock Name/i)).toBeInTheDocument()
        expect(screen.getByText(/123/i)).toBeInTheDocument()
        expect(screen.getByText(/Mock Street/i)).toBeInTheDocument()

        // 2) Click "Edit Profile" to switch into editing view
        fireEvent.click(screen.getByRole('button', { name: /Edit Profile/i }))

        // 3) Inputs appear
        expect(await screen.findByLabelText(/Name/i)).toBeInTheDocument()
        expect(screen.getByLabelText(/Phone number/i)).toBeInTheDocument()
        expect(screen.getByLabelText(/Address/i)).toBeInTheDocument()
    })
})

*/
