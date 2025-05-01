import { Button, Label, TextInput, Alert } from "flowbite-react";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { useUserAuth } from "../context/userAuthContext";
import { HiInformationCircle } from "react-icons/hi";
import { AuthError } from "firebase/auth";
import { FaEye, FaEyeSlash, FaGoogle } from "react-icons/fa";

function LoginPage() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [successMessage, setSuccessMessage] = useState("");
    const [errorMessage, setErrorMessage] = useState("");

    const { logIn, googleSignIn, logOut } = useUserAuth();
    const navigate = useNavigate();

    const handleSignUp = () => {
        navigate("/sign-up");
    };

    const handleReset = () => {
        navigate("/reset-password");
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        try {
            const userCredential = await logIn(email, password);
            const user = userCredential.user;

            if (!user.emailVerified) {
                setErrorMessage("Please verify your email before logging in.");
                await logOut();
                return;
            }

            console.log("User logged in successfully:", user);
            setSuccessMessage("User logged in successfully.");
            setErrorMessage("");
            navigate("/menu");
        } catch (error) {
            console.error("Error logging in:", error);
            const authError = error as AuthError;

            if (authError.code === "auth/wrong-password") {
                setErrorMessage("Wrong password, try again.");
            } else {
                setErrorMessage("Login failed. Please check your credentials.");
            }

            setSuccessMessage("");
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

            <h1>Login</h1>

            <div className="self-center mt-3 mb-3">
                <Button
                    type="button"
                    onClick={async () => {
                        try {
                            await googleSignIn();
                            navigate("/menu");
                        } catch (error) {
                            console.error("Google sign-in error:", error);
                            setErrorMessage("Google sign-in failed. Please try again.");
                        }
                    }}
                    className="my-pretty-button flex items-center justify-center">
                    <span className="text-[#f4e9e1]"> <FaGoogle size={18} /></span>
                    <span className="text-[#f4e9e1] ml-2"> Sign in with Google </span>
                </Button>
            </div>

            <div className="w-2/5 max-w-sm">
                <form className="flex flex-col gap-4" onSubmit={handleSubmit} autoComplete="on">
                    <div className="mt-4">
                        <div className="mb-2 block">
                            <Label htmlFor="email1">
                                <span className="flex items-center gap-2 text-[#362314] font-medium ml-2 mb-2">Your email</span>
                            </Label>
                        </div>
                        <TextInput
                            id="email1"
                            type="email"
                            autoComplete="email"
                            placeholder="name@gmail.com"
                            required
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        />
                    </div>

                    <div>
                        <div className="mb-2">
                            <Label htmlFor="password1">
                                <span className="flex items-center gap-2 text-[#362314] font-medium ml-2 mb-2">Your password</span>
                            </Label>
                        </div>
                        <div className="relative">
                            <TextInput
                                id="password1"
                                type={showPassword ? "text" : "password"}
                                autoComplete="current-password"
                                required
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                placeholder="password"
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword(prev => !prev)}
                                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-[#523a28] focus:outline-none"
                            >
                                {showPassword ? <FaEyeSlash size={18} /> : <FaEye size={18} />}
                            </button>
                        </div>
                    </div>

                    <Button type="submit" className="my-button">
                        <span className="text-[#f4e9e1]"> Submit </span>
                    </Button>

                    <div className="text-[#362314] mt-4">
                        <p>Don't have an account? <a className="underline cursor-pointer" onClick={handleSignUp}>
                            Sign up </a>
                        </p>
                    </div>
                    <div className="text-[#362314]">
                        <p>Forgot password? <a className="underline cursor-pointer" onClick={handleReset}> Reset pasword </a>
                        </p>
                    </div>
                </form>
            </div>
        </main>
    );
} export default LoginPage;
