import '@testing-library/jest-dom';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';

const mockNavigate = vi.fn();
vi.mock('react-router-dom', async () => {
    const actual = await import('react-router-dom');
    return {
        ...actual,
        useNavigate: () => mockNavigate,
    };
});

import FloatingTimerButton from './FloatingTimerButton';

beforeEach(() => {
    localStorage.clear();
    mockNavigate.mockClear();
});

describe('FloatingTimerButton', () => {
    it('does NOT render when no timer_ keys in localStorage', () => {
        render(
            <MemoryRouter>
                <FloatingTimerButton />
            </MemoryRouter>
        );

        expect(screen.queryByRole('button', { name: /view active timers/i })).toBeNull();
    });

    it('renders when there is a timer_ key in localStorage', () => {
        localStorage.setItem('timer_123', JSON.stringify({ endTime: Date.now() + 60000 }));

        render(
            <MemoryRouter>
                <FloatingTimerButton />
            </MemoryRouter>
        );

        expect(screen.getByRole('button', { name: /view active timers/i })).toBeInTheDocument();
    });

    it('navigates to /delivery-timer when clicked', () => {
        localStorage.setItem('timer_abc', 'somevalue');

        render(
            <MemoryRouter>
                <FloatingTimerButton />
            </MemoryRouter>
        );

        const button = screen.getByRole('button', { name: /view active timers/i });
        fireEvent.click(button);

        expect(mockNavigate).toHaveBeenCalledWith('/delivery-timer');
    });
});