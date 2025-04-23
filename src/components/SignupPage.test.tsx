import '@testing-library/jest-dom';
import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { BrowserRouter } from "react-router-dom";
import { UserAuthProvider } from "../context/userAuthContext";
import SignupPage from "./SignupPage";

vi.mock("firebase/auth", async (importOriginal) => {
    const actual = await importOriginal<typeof import("firebase/auth")>();
    return {
        ...actual,
        sendEmailVerification: vi.fn(() => Promise.resolve()),
        getAuth: vi.fn(() => ({})),
        onIdTokenChanged: vi.fn(() => () => { }),
    };
});

vi.mock("../context/userAuthContext", async (importOriginal) => {
    const actual = await importOriginal<typeof import("../context/userAuthContext")>();
    return {
        ...actual,
        useUserAuth: () => ({
            signUp: vi.fn(() =>
                Promise.resolve({
                    user: { email: "test@example.com", uid: "123", emailVerified: false },
                })
            ),
            googleSignIn: vi.fn(),
            logOut: vi.fn(),
        }),
    };
});


describe("SignupPage - Functional Test", () => {
    it("allows user to sign up and shows verification message", async () => {
        render(
            <BrowserRouter>
                <UserAuthProvider>
                    <SignupPage />
                </UserAuthProvider>
            </BrowserRouter>
        );

        fireEvent.change(screen.getByLabelText(/your email/i), {
            target: { value: "test@example.com" },
        });
        fireEvent.change(screen.getByLabelText(/your password/i), {
            target: { value: "password123" },
        });

        fireEvent.click(screen.getByRole("button", { name: /submit/i }));

        await waitFor(() => {
            expect(
                screen.getByText(/please check your verification email/i)
            ).toBeInTheDocument();
            expect(
                screen.getByText(/we’ve sent a verification link/i)
            ).toBeInTheDocument();
        });
    });
});
