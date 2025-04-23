import { Button, Label, TextInput } from "flowbite-react";
import { useState } from "react";
import { useUserAuth } from "../context/userAuthContext";
import { useNavigate } from "react-router-dom";
import { AuthError, sendEmailVerification } from "firebase/auth";
import { FaEye, FaEyeSlash, FaGoogle } from "react-icons/fa";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { db } from "../libs/firebase";

function SignupPage() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [errorMessage, setErrorMessage] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [emailSent, setEmailSent] = useState(false);

    const { signUp, googleSignIn } = useUserAuth();
    const navigate = useNavigate();

    const isValidEmail = (email: string) => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    };

    const handleLogin = () => {
        navigate("/login");
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        if (!isValidEmail(email)) {
            setErrorMessage("Please enter a valid email address.");
            return;
        }

        try {
            const userCredential = await signUp(email, password);
            const user = userCredential.user;

            await sendEmailVerification(user, {
                url: `${window.location.origin}/login`,
                handleCodeInApp: false,
            });

            setEmailSent(true);
            setErrorMessage("");
        } catch (error) {
            const authError = error as AuthError;
            if (authError.code === "auth/email-already-in-use") {
                setErrorMessage("User already exists. Please log in.");
            } else {
                setErrorMessage("Error signing up. Please try again.");
            }
        }
    };

    const handleGoogleSignIn = async () => {
        try {
            const result = await googleSignIn();
            const user = result.user;

            const userRef = doc(db, "users", user.uid);
            const userSnap = await getDoc(userRef);

            if (!userSnap.exists()) {
                await setDoc(userRef, {
                    email: user.email,
                    name: user.displayName || "",
                    createdAt: new Date(),
                    isAdmin: false,
                });
            }

            navigate("/menu");
        } catch (error) {
            setErrorMessage("Google sign-in failed. Please try again.");
        }
    };

    return (
        <main className="main-background">
            <header className="mb-6">Sign Up</header>

            {emailSent ? (
                <div className="bg-green-100 border border-green-300 text-green-900 p-6 rounded-lg shadow-md w-full max-w-md text-center">
                    <h2 className="text-lg font-semibold mb-2">Please check your verification email.</h2>
                    <p className="mb-4">We’ve sent a verification link to <span className="font-medium">{email}</span>.</p>
                    <Button color="success" onClick={handleLogin}>
                        Go to Login
                    </Button>
                </div>
            ) : (
                <div className="w-2/5 max-w-sm">
                    <div className="mt-3 mb-3 w-fit mx-auto">
                        <Button
                            type="button"
                            onClick={handleGoogleSignIn}
                            className="my-pretty-button flex items-center justify-center"
                        >
                            <span className="text-[#f4e9e1]"><FaGoogle size={18} /></span>
                            <span className="text-[#f4e9e1] ml-2"> Sign up with Google </span>
                        </Button>
                    </div>

                    <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
                        <div>
                            <Label htmlFor="email1">
                                <span className="text-[#362314] font-medium">Your email</span>
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

                        <div>
                            <Label htmlFor="password1">
                                <span className="text-[#362314] font-medium">Your password</span>
                            </Label>
                            <div className="relative">
                                <TextInput
                                    id="password1"
                                    type={showPassword ? "text" : "password"}
                                    required
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    autoComplete="new-password"
                                    placeholder="password"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword((prev) => !prev)}
                                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-[#523a28] focus:outline-none"
                                >
                                    {showPassword ? <FaEyeSlash size={18} /> : <FaEye size={18} />}
                                </button>
                            </div>
                        </div>

                        <Button type="submit" className="my-button">
                            <span className="text-[#f4e9e1]">Submit</span>
                        </Button>

                        {errorMessage && (
                            <p className="text-red-600 text-sm text-center mt-2">{errorMessage}</p>
                        )}
                    </form>

                    <div className="text-[#362314] mt-4 text-center">
                        <p>Already have an account? <span className="underline cursor-pointer" onClick={handleLogin}>Login</span></p>
                    </div>
                </div>
            )}
        </main>
    );
}

export default SignupPage;
