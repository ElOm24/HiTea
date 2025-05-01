import {
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
    signOut,
    signInWithPopup,
    GoogleAuthProvider,
    User,
    onIdTokenChanged,
} from "firebase/auth";
import { collection, query, where, getDocs, doc, setDoc } from "firebase/firestore";
import { createContext, useEffect, useState, useContext } from "react";
import { db, auth } from "../libs/firebase";

interface IUserAuthProviderProps {
    children: React.ReactNode;
}

type AuthContextData = {
    user: User | null;
    isAdmin: boolean;
    logIn: typeof logIn;
    signUp: typeof signUp;
    logOut: typeof logOut;
    googleSignIn: typeof googleSignIn;
    setUser: React.Dispatch<React.SetStateAction<User | null>>;
};

const logIn = (email: string, password: string) => {
    return signInWithEmailAndPassword(auth, email, password);
};

const signUp = async (email: string, password: string) => {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;
    await setDoc(doc(db, "users", user.uid), {
        uid: user.uid,
        email: user.email,
        createdAt: new Date().toISOString(),
    });
    return userCredential;
};

const logOut = () => {
    return signOut(auth);
};

const googleSignIn = () => {
    const provider = new GoogleAuthProvider();
    return signInWithPopup(auth, provider);
};

export const userAuthContext = createContext<AuthContextData>({
    user: null,
    isAdmin: false,
    logIn,
    signUp,
    logOut,
    googleSignIn,
    setUser: () => { },
});

export const UserAuthProvider: React.FC<IUserAuthProviderProps> = ({ children }) => {
    const [user, setUser] = useState<User | null>(null);
    const [isAdmin, setIsAdmin] = useState(false);

    useEffect(() => {
        const unsubscribe = onIdTokenChanged(auth, async (currentUser) => {
            console.log("the ID token has been changed, the new user is:", currentUser);
            setUser(currentUser);

            if (currentUser?.email) {
                const q = query(
                    collection(db, "specialUsers"),
                    where("email", "==", currentUser.email),
                    where("isAdmin", "==", true)
                );
                const snap = await getDocs(q);
                setIsAdmin(!snap.empty);
            } else {
                setIsAdmin(false);
            }
        });

        return () => unsubscribe();
    }, []);

    const value: AuthContextData = {
        user,
        isAdmin,
        logIn,
        signUp,
        logOut,
        googleSignIn,
        setUser,
    };

    return (
        <userAuthContext.Provider value={value}>
            {children}
        </userAuthContext.Provider>
    );
};

export const useUserAuth = () => useContext(userAuthContext);