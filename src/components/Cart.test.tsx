import '@testing-library/jest-dom';
import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { BrowserRouter } from "react-router-dom";
import { within } from "@testing-library/react";

import Cart from "./Cart";

const mockClearCart = vi.fn();
const mockIncreaseQuantity = vi.fn();
const mockDecreaseQuantity = vi.fn();

vi.mock("../context/CartContext", () => ({
    useShoppingCart: () => ({
        cartItems: [
            {
                id: "1",
                name: "Mango Tea",
                quantity: 2,
                size: "Large",
                temperature: "Cold",
                toppings: ["boba", "jelly"],
                price: 1200,
            },
        ],
        clearCart: mockClearCart,
        increaseQuantity: mockIncreaseQuantity,
        decreaseQuantity: mockDecreaseQuantity,
    }),
}));

const mockNavigate = vi.fn();
vi.mock("react-router-dom", async (importOriginal) => {
    const actual = await importOriginal() as Record<string, unknown>;
    return {
        ...actual,
        useNavigate: () => mockNavigate,
    };
});

const renderCart = () => {
    render(
        <BrowserRouter>
            <Cart />
        </BrowserRouter>
    );
};

describe("Cart Component", () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    it("displays cart icon with correct quantity", () => {
        renderCart();

        const cartButton = screen.getByLabelText("Open Cart");
        expect(cartButton).toBeInTheDocument();

        expect(within(cartButton).getByText("2")).toBeInTheDocument();
    });


    it("opens the sidebar when cart icon is clicked", () => {
        renderCart();
        fireEvent.click(screen.getByLabelText("Open Cart"));
        expect(screen.getByRole("heading", { name: /your cart/i })).toBeInTheDocument();
    });

    it("calls increase and decrease functions when buttons are clicked", () => {
        renderCart();
        fireEvent.click(screen.getByLabelText("Open Cart"));

        fireEvent.click(screen.getByLabelText("Increase quantity of Mango Tea"));
        expect(mockIncreaseQuantity).toHaveBeenCalledWith("1");

        fireEvent.click(screen.getByLabelText("Decrease quantity of Mango Tea"));
        expect(mockDecreaseQuantity).toHaveBeenCalledWith("1");
    });


    it("calls clearCart when Clear Cart button is clicked", () => {
        renderCart();
        fireEvent.click(screen.getByLabelText("Open Cart"));

        const clearButton = screen.getByRole("button", { name: /clear cart/i });
        fireEvent.click(clearButton);

        expect(mockClearCart).toHaveBeenCalled();
    });

    it("navigates to /check-out when Checkout button is clicked", () => {
        renderCart();
        expect(screen.getByLabelText("Open Cart")).toBeInTheDocument();

        const checkoutButton = screen.getByRole("button", { name: /checkout/i });
        fireEvent.click(checkoutButton);

        expect(mockNavigate).toHaveBeenCalledWith("/check-out");
    });
});
