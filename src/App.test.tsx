import '@testing-library/jest-dom'
import { render, screen } from '@testing-library/react'
import { describe, it, expect, vi } from 'vitest'
import { MemoryRouter } from 'react-router-dom'
import React from 'react'
import App from './App'

vi.mock('react-router-dom', async () => {
    const actual = await vi.importActual<typeof import('react-router-dom')>(
        'react-router-dom'
    )
    return {
        ...actual,
        BrowserRouter: ({ children }: { children: React.ReactNode }) => <>{children}</>,
    }
})

describe('app routing (functional)', () => {
    it('renders Home component at "/"', () => {
        render(
            <MemoryRouter initialEntries={['/']}>
                <App />
            </MemoryRouter>
        )
        expect(screen.getByRole('heading', { name: /welcome to hitea/i })).toBeInTheDocument();
    })

    it('renders LoginPage at "/login"', () => {
        render(
            <MemoryRouter initialEntries={['/login']}>
                <App />
            </MemoryRouter>
        )
        expect(
            screen.getByRole('heading', { name: /^Login$/i })
        ).toBeInTheDocument()
    })

    it('renders ErrorPage for unknown routes', () => {
        render(
            <MemoryRouter initialEntries={['/no-such-route']}>
                <App />
            </MemoryRouter>
        )
        expect(screen.getByText(/page does not exist/i)).toBeInTheDocument()
        expect(
            screen.getByText(/please click on one of the valid links above/i)
        ).toBeInTheDocument()
    })

    it('renders ContactPage at "/contact"', async () => {
        render(
            <MemoryRouter initialEntries={['/contact']}>
                <App />
            </MemoryRouter>
        )
        expect(await screen.findByText(/Astoria/i)).toBeInTheDocument()
    })
})