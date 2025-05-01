import '@testing-library/jest-dom'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { MemoryRouter } from 'react-router-dom'
import React from 'react'
import LoginPage from './LoginPage'

const mockNavigate = vi.fn()
vi.mock('react-router-dom', async () => {
    const actual = (await vi.importActual<typeof import('react-router-dom')>(
        'react-router-dom'
    ))
    return {
        ...actual,
        useNavigate: () => mockNavigate,
    }
})

const mockGoogleSignIn = vi.fn()
const mockLogIn = vi.fn().mockResolvedValue({ user: { emailVerified: true } })
const mockLogOut = vi.fn()

vi.mock('../context/userAuthContext', () => ({
    useUserAuth: () => ({
        logIn: mockLogIn,
        googleSignIn: mockGoogleSignIn,
        logOut: mockLogOut,
    }),
    UserAuthProvider: ({ children }: { children: React.ReactNode }) => <>{children}</>,
}))


describe('LoginPage – functional Google and email sign-in', () => {
    beforeEach(() => {
        mockNavigate.mockClear()
        mockGoogleSignIn.mockClear()
        mockLogIn.mockClear()
        mockLogOut.mockClear()
    })

    it('calls googleSignIn and navigates to MenuPage on success', async () => {
        mockGoogleSignIn.mockResolvedValueOnce({ user: { emailVerified: true } })

        render(
            <MemoryRouter>
                <LoginPage />
            </MemoryRouter>
        )

        fireEvent.click(screen.getByRole('button', { name: /sign in with google/i }))

        await waitFor(() => {
            expect(mockGoogleSignIn).toHaveBeenCalled()
            expect(mockNavigate).toHaveBeenCalledWith('/menu')
        })
    })

    it('shows an error alert when googleSignIn rejects', async () => {
        mockGoogleSignIn.mockRejectedValueOnce(new Error('Network failure'))

        render(
            <MemoryRouter>
                <LoginPage />
            </MemoryRouter>
        )

        fireEvent.click(screen.getByRole('button', { name: /sign in with google/i }))

        await waitFor(() => {
            const alert = screen.getByRole('alert')
            expect(alert).toHaveTextContent(/google sign-in failed\. please try again\./i)
        })
    })

    it('allows user to type email/password and submit', async () => {
        mockLogIn.mockResolvedValueOnce({ user: { emailVerified: true } })

        render(
            <MemoryRouter>
                <LoginPage />
            </MemoryRouter>
        )

        fireEvent.change(screen.getByLabelText(/your email/i), {
            target: { value: 'test@example.com' },
        })
        fireEvent.change(screen.getByLabelText(/your password/i), {
            target: { value: 'password123' },
        })

        fireEvent.click(screen.getByRole('button', { name: /submit/i }))

        await waitFor(() => {
            expect(mockLogIn).toHaveBeenCalledWith('test@example.com', 'password123')
            expect(screen.getByText(/user logged in successfully/i)).toBeInTheDocument()
            expect(mockNavigate).toHaveBeenCalledWith('/menu')
        })
    })
})