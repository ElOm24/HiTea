import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import ContactPage from "./ContactPage";
import { BrowserRouter } from "react-router-dom";
import { UserAuthProvider } from "../context/userAuthContext";
import '@testing-library/jest-dom';

// 🧪 Mock Firestore methods
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


// 🧪 Mock useUserAuth with a fake user
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
        vi.clearAllMocks(); // reset mocks between tests
    });

    it("renders the restaurant tabs and allows rating flow", async () => {
        render(
            <BrowserRouter>
                <UserAuthProvider>
                    <ContactPage />
                </UserAuthProvider>
            </BrowserRouter>
        );

        // 🟢 Wait for tabs to load (Astoria should be visible)
        expect(await screen.findByText(/Astoria/i)).toBeInTheDocument();

        // 🟢 Click "Leave a review" button
        const reviewButtons = screen.getAllByText(/Leave a review/i);
        fireEvent.click(reviewButtons[0]); // Click the one for Astoria

        // 🟢 Modal opens with prompt
        expect(await screen.findByText(/How was your experience/i)).toBeInTheDocument();

        // 🟢 Click 4th star
        const stars = screen.getAllByRole("button").filter((btn) =>
            btn.querySelector("svg")
        );
        fireEvent.click(stars[3]); // Select 4 stars

        // 🟢 Enter a short review
        fireEvent.change(screen.getByPlaceholderText(/Write a short review/i), {
            target: { value: "Amazing!" },
        });

        // 🟢 Submit
        fireEvent.click(screen.getByText(/Submit/i));

        // 🟢 Expect success alert to appear
        await waitFor(() =>
            expect(
                screen.getByText(/Thanks for your feedback/i)
            ).toBeInTheDocument()
        );
    });
});
