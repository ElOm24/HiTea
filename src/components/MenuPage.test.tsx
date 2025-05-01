import '@testing-library/jest-dom';
import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { UserAuthProvider } from '../context/userAuthContext';
import { CartProvider } from '../context/CartContext';
import MenuPage from './MenuPage';

vi.mock('firebase/firestore', async (importOriginal) => {
    const actual = await importOriginal() as Record<string, unknown>;

    return {
        ...actual,
        collection: vi.fn(() => ({})),
        addDoc: vi.fn().mockResolvedValue({ id: 'test-id' }),
        getDocs: vi.fn().mockResolvedValue({ docs: [] }),
        doc: vi.fn(() => ({})),
        updateDoc: vi.fn(),
        deleteDoc: vi.fn(),
    };
});

vi.mock('../context/userAuthContext', async (importOriginal) => {
    const actual = await importOriginal() as Record<string, unknown>;

    return {
        ...actual,
        useUserAuth: () => ({ isAdmin: true, user: { email: 'admin@hitea.com' } }),
        UserAuthProvider: actual.UserAuthProvider,
    };
});

describe('MenuPage - Admin Add Item', () => {
    it('allows admin to open dialog, add a new item, and close modal', async () => {
        render(
            <BrowserRouter>
                <UserAuthProvider>
                    <CartProvider>
                        <MenuPage />
                    </CartProvider>
                </UserAuthProvider>
            </BrowserRouter>
        );

        fireEvent.click(screen.getByRole('button', { name: /Add Bubble Tea/i }));

        expect(await screen.findByRole('heading', { name: /Add Bubble Tea/i })).toBeInTheDocument();

        fireEvent.change(screen.getByPlaceholderText(/Image ID/i), {
            target: { value: '1' },
        });
        fireEvent.change(screen.getByPlaceholderText(/Product name/i), {
            target: { value: 'Mango Tea' },
        });
        fireEvent.change(screen.getByPlaceholderText(/Price/i), {
            target: { value: '1500' },
        });
        fireEvent.change(screen.getByPlaceholderText(/Description/i), {
            target: { value: 'Sweet tropical mango tea' },
        });

        fireEvent.click(screen.getAllByRole('button', { name: /Add/i }).at(-1)!);

        await waitFor(() => {
            expect(screen.queryByRole('heading', { name: /Add Bubble Tea/i })).not.toBeInTheDocument();
        });
    });

});