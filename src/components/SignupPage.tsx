import { Button, Label, TextInput } from "flowbite-react";
import { useState } from "react";
import { useUserAuth } from "../context/userAuthContext";
import { Alert } from "flowbite-react"
import { HiInformationCircle } from "react-icons/hi";
import { useNavigate } from "react-router-dom";
import { AuthError } from "firebase/auth";
import { FaEye, FaEyeSlash } from "react-icons/fa";


function SignupPage() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [successMessage, setSuccessMessage] = useState("");
    const [errorMessage, setErrorMessage] = useState("");
    const [showPassword, setShowPassword] = useState(false);

    const { signUp } = useUserAuth();
    const navigate = useNavigate();

    const handleLogin = () => {
        navigate("/login");
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        try {
            const userCredential = await signUp(email, password);
            console.log("User created successfully:", userCredential.user);
            setSuccessMessage("User was created successfully.");
            setErrorMessage("");

            navigate("/menu");
        } catch (error) {
            console.error("Error signing up:", error);

            const authError = error as AuthError;

            if (authError.code === "auth/email-already-in-use") {
                setErrorMessage("User exists already, please login.");

            } else {
                setErrorMessage("Error signing up. Please try again.");
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
                    <Alert color="failure" icon={HiInformationCircle} onDismiss={() => setErrorMessage("")}>
                        {errorMessage}
                    </Alert>
                )}
            </div>

            <header>Sign up</header>
            <div className="w-2/5 max-w-sm">
                <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
                    <div>
                        <div className="mt-4 block">
                            <Label htmlFor="email1">
                                <span className="flex items-center gap-2 text-[#362314] font-medium ml-2 mb-2">Your email</span>
                            </Label>
                        </div>
                        <TextInput id="email1" type="email" placeholder="name@gmail.com" required value={email}
                            onChange={(e) => setEmail(e.target.value)} />
                    </div>
                    <div>
                        <div className="mb-2 block">
                            <Label htmlFor="password1" >
                                <span className="flex items-center gap-2 text-[#362314] font-medium ml-2 mb-2">Your password</span>
                            </Label>
                        </div>
                        <div className="relative">
                            <TextInput
                                id="password1"
                                type={showPassword ? "text" : "password"}
                                required
                                value={password}
                                placeholder="password"
                                onChange={(e) => setPassword(e.target.value)}
                                className="pr-10"
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword((prev) => !prev)}
                                className="absolute right-2 top-1/2 transform -translate-y-1/2 text-[#523a28]"
                            >
                                {showPassword ? <FaEyeSlash size={18} /> : <FaEye size={18} />}
                            </button>
                        </div>
                    </div>
                    <Button type="submit" className="my-button"><span className="text-[#f4e9e1]"> Submit </span></Button>
                </form>

                <div className="text-[#362314] mt-4">
                    <p>Already have an account?</p>
                    <a className="underline cursor-pointer" onClick={handleLogin}>
                        Login
                    </a>
                </div>
            </div>
        </main>
    );
}

export default SignupPage;
