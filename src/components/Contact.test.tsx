import '@testing-library/jest-dom';
import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { BrowserRouter } from "react-router-dom";
import { UserAuthProvider } from "../context/userAuthContext";
import ContactPage from "./ContactPage";

vi.mock("firebase/firestore", async (importOriginal) => {
    const actual = await importOriginal() as Record<string, unknown>;
    return {
        ...actual,
        addDoc: vi.fn(() => Promise.resolve()),
        getDocs: vi.fn(() => Promise.resolve({ docs: [] })),
        query: vi.fn(),
        where: vi.fn(),
        collection: vi.fn(),
    };
});


vi.mock("../context/userAuthContext", async (importOriginal) => {
    const actual = await importOriginal<typeof import("../context/userAuthContext")>();
    return {
        ...actual,
        useUserAuth: () => ({
            user: {
                email: "test@example.com",
                displayName: "Test User",
                uid: "123",
            },
        }),
    };
});


describe("ContactPage - Functional Test", () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    it("renders the restaurant tabs and allows rating flow", async () => {
        render(
            <BrowserRouter>
                <UserAuthProvider>
                    <ContactPage />
                </UserAuthProvider>
            </BrowserRouter>
        );

        expect(await screen.findByText(/Astoria/i)).toBeInTheDocument();

        const reviewButtons = screen.getAllByText(/Leave a review/i);
        fireEvent.click(reviewButtons[0]);

        expect(await screen.findByText(/How was your experience/i)).toBeInTheDocument();

        const stars = screen.getAllByRole("button").filter((btn) =>
            btn.querySelector("svg")
        );
        fireEvent.click(stars[3]);

        fireEvent.change(screen.getByPlaceholderText(/Write a short review/i), {
            target: { value: "Amazing!" },
        });

        fireEvent.click(screen.getByText(/Submit/i));

        await waitFor(() =>
            expect(
                screen.getByText(/Thanks for your feedback/i)
            ).toBeInTheDocument()
        );
    });
});