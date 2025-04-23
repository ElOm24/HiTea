// src/components/DeliveryTimerPage.test.tsx
import React from 'react'
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import {
    render,
    screen,
    fireEvent,
    act,
    cleanup,           // ← unmounts & runs effect cleanups
} from '@testing-library/react'
import '@testing-library/jest-dom'

// 1️⃣ Mock react-router before importing the component
const mockNavigate = vi.fn()
vi.mock('react-router-dom', async () => {
    const actual = (await vi.importActual('react-router-dom')) as any
    return {
        ...actual,
        useNavigate: () => mockNavigate,
    }
})

import DeliveryTimerPage from './DeliveryTimerPage'
import { MemoryRouter, Routes, Route } from 'react-router-dom'

function createTimer(orderId: string, seconds: number, isDelivery = true) {
    localStorage.setItem(
        `timer_${orderId}`,
        JSON.stringify({ endTime: Date.now() + seconds * 1000, isDelivery })
    )
}

function renderPage(state = {}) {
    return render(
        <MemoryRouter initialEntries={[{ pathname: '/delivery-timer', state }]}>
            <Routes>
                <Route path="/delivery-timer" element={<DeliveryTimerPage />} />
                <Route path="/menu" element={<div>Mock Menu</div>} />
            </Routes>
        </MemoryRouter>
    )
}

describe('DeliveryTimerPage', () => {
    beforeEach(() => {
        localStorage.clear()
        mockNavigate.mockClear()
        // ensure any prior fake timers are reset
        vi.useRealTimers()
    })

    afterEach(() => {
        // 1) unmounts the React tree, which runs your effect cleanup → clears the interval  
        // 2) kills any timers (just in case)  
        // 3) restores real timers for the next test
        cleanup()
        vi.clearAllTimers()
        vi.useRealTimers()
    })

    it('redirects to /menu if no timers and no justPlacedOrderId', () => {
        renderPage()
        expect(mockNavigate).toHaveBeenCalledWith('/menu')
    })

    it('shows countdown timer if localStorage has a timer', async () => {
        createTimer('abc123', 90)
        renderPage()

        const heading = await screen.findByRole('heading', {
            name: /your order is on the way/i,
        })
        expect(heading).toBeInTheDocument()
        expect(screen.getByText(/order id: abc123/i)).toBeInTheDocument()
    })

    it('removes timer and navigates back on close if time is up', () => {
        createTimer('order1', 0)

        // use fake timers here so we can immediately tick the 1s interval
        vi.useFakeTimers()

        renderPage()

        act(() => {
            vi.advanceTimersByTime(1000)
        })

        // after that tick, timeUp===true and we should see the "arrived" UI
        expect(screen.getByText(/order has arrived!/i)).toBeInTheDocument()

        fireEvent.click(screen.getByRole('button', { name: '✕' }))

        expect(localStorage.getItem('timer_order1')).toBeNull()
        expect(mockNavigate).toHaveBeenCalledWith('/menu')
    })

    it('removes timer on close (not expired)', async () => {
        createTimer('order2', 30)
        renderPage()

        await screen.findByText(/order id: order2/i)

        fireEvent.click(screen.getByRole('button', { name: '✕' }))

        expect(localStorage.getItem('timer_order2')).toBeNull()
        expect(mockNavigate).not.toHaveBeenCalled()
    })
})
