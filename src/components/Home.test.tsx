import '@testing-library/jest-dom'
import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import React from 'react'

vi.mock('flowbite-react', () => ({
    Carousel: ({ children }: { children: React.ReactNode }) => (
        <div data-testid="carousel">{children}</div>
    ),
}))

import Home from './Home'

describe('Home component', () => {
    it('renders the welcome header and section title', () => {
        render(<Home />)
        expect(screen.getByText('Welcome to HiTea!')).toBeInTheDocument()
        expect(
            screen.getByRole('heading', { level: 2, name: /current special offers:/i })
        ).toBeInTheDocument()
    })

    it('renders exactly five offer images with correct alts and srcs', () => {
        render(<Home />)

        const images = screen.getAllByRole('img')
        expect(images).toHaveLength(5)

        const expectedAlts = ['offer1', 'offer2', 'offer3', 'offer4', 'offer5']
        expect(images.map((img) => img.getAttribute('alt'))).toEqual(expectedAlts)

        expectedAlts.forEach((alt) => {
            const img = screen.getByAltText(alt)
            expect(img).toHaveAttribute('src', expect.stringContaining(`${alt}.png`))
        })
    })

    it('wraps images in a flowbite Carousel', () => {
        render(<Home />)
        expect(screen.getByTestId('carousel')).toBeInTheDocument()
    })
})