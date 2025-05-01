import { useState } from "react";
import { sendPasswordResetEmail } from "firebase/auth";
import { Alert, Button, Label, TextInput } from "flowbite-react";
import { HiInformationCircle } from "react-icons/hi";
import { auth } from "../libs/firebase";
import { useNavigate } from "react-router-dom";

function ResetPasswordPage() {
    const [email, setEmail] = useState("");
    const [successMessage, setSuccessMessage] = useState("");
    const [errorMessage, setErrorMessage] = useState("");
    const navigate = useNavigate();

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setSuccessMessage("");
        setErrorMessage("");

        try {
            await sendPasswordResetEmail(auth, email);
            setSuccessMessage("Password reset email sent successfully.");

            setTimeout(() => {
                navigate("/login");
            }, 2500);

        } catch (error) {
            console.error("Error sending reset email:", error);
            setErrorMessage("Failed to send password reset email. Try again.");
        }
    };

    return (
        <main className="main-background">
            <div className="fixed top-4 left-1/2 transform -translate-x-1/2 z-50 w-[90%] max-w-md">
                {successMessage && (
                    <Alert color="success" onDismiss={() => setSuccessMessage("")}>
                        {successMessage}
                    </Alert>
                )}
                {errorMessage && (
                    <Alert
                        color="failure"
                        icon={HiInformationCircle}
                        onDismiss={() => setErrorMessage("")}
                    >
                        {errorMessage}
                    </Alert>
                )}
            </div>

            <h1>Reset Password</h1>

            <div className="w-2/5 max-w-sm mx-auto mt-6">
                <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
                    <div className="mb-2 block">
                        <Label htmlFor="email1">
                            <span className="flex items-center gap-2 text-[#362314] font-medium ml-2 mb-2">
                                Enter your email
                            </span>
                        </Label>
                        <TextInput
                            id="email1"
                            type="email"
                            placeholder="name@gmail.com"
                            required
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        />
                    </div>

                    <Button type="submit" className="my-button">
                        <span className="text-[#f4e9e1]">Send Reset Email</span>
                    </Button>
                </form>
            </div>
        </main>
    );
}

export default ResetPasswordPage;
