import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import LoginPage from "./LoginPage";
import { BrowserRouter } from "react-router-dom";
import { UserAuthProvider } from "../context/userAuthContext";
import '@testing-library/jest-dom';

// Mock the entire userAuthContext module
vi.mock("../context/userAuthContext", async () => {
    const actual = await vi.importActual<typeof import("../context/userAuthContext")>(
        "../context/userAuthContext"
    );

    return {
        ...actual,
        useUserAuth: () => ({
            logIn: vi.fn().mockResolvedValue({
                user: { emailVerified: true },
            }),
            googleSignIn: vi.fn(),
            logOut: vi.fn(),
        }),
    };
});

describe("LoginPage - Functional", () => {
    it("allows user to type email and password and submit", async () => {
        render(
            <BrowserRouter>
                <UserAuthProvider>
                    <LoginPage />
                </UserAuthProvider>
            </BrowserRouter>
        );

        const emailInput = screen.getByLabelText(/your email/i);
        const passwordInput = screen.getByLabelText(/your password/i);
        const submitButton = screen.getByRole("button", { name: /submit/i });

        // Simulate typing
        fireEvent.change(emailInput, { target: { value: "test@example.com" } });
        fireEvent.change(passwordInput, { target: { value: "password123" } });

        // Submit the form
        fireEvent.click(submitButton);

        // Wait for the success message to appear
        await waitFor(() =>
            expect(screen.getByText(/user logged in successfully/i)).toBeInTheDocument()
        );
    });
});
