import '@testing-library/jest-dom';
import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { BrowserRouter } from "react-router-dom";
import ResetPasswordPage from "./ResetPasswordPage";
import * as firebaseAuth from "firebase/auth";

vi.mock("firebase/auth", async (importOriginal) => {
    const actual = await importOriginal() as Record<string, unknown>;
    return {
        ...actual,
        sendPasswordResetEmail: vi.fn(),
    };
});

beforeEach(() => {
    vi.clearAllMocks();
});

function renderPage() {
    render(
        <BrowserRouter>
            <ResetPasswordPage />
        </BrowserRouter>
    );
}

describe("ResetPasswordPage", () => {
    it("renders email input and submit button", () => {
        renderPage();

        expect(screen.getByLabelText(/enter your email/i)).toBeInTheDocument();
        expect(screen.getByRole("button", { name: /send reset email/i })).toBeInTheDocument();
    });

    it("shows success message on valid email submission", async () => {
        vi.spyOn(firebaseAuth, "sendPasswordResetEmail").mockResolvedValueOnce(undefined);

        renderPage();

        fireEvent.change(screen.getByPlaceholderText(/name@gmail.com/i), {
            target: { value: "test@example.com" },
        });

        fireEvent.click(screen.getByRole("button", { name: /send reset email/i }));

        await waitFor(() => {
            expect(screen.getByText(/password reset email sent successfully/i)).toBeInTheDocument();
        });
    });

    it("shows error message if sending reset email fails", async () => {
        vi.spyOn(firebaseAuth, "sendPasswordResetEmail").mockRejectedValueOnce(new Error("Network error"));

        renderPage();

        fireEvent.change(screen.getByPlaceholderText(/name@gmail.com/i), {
            target: { value: "test@example.com" },
        });

        fireEvent.click(screen.getByRole("button", { name: /send reset email/i }));

        await waitFor(() => {
            expect(screen.getByText(/failed to send password reset email/i)).toBeInTheDocument();
        });
    });
});
