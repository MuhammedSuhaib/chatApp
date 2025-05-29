"use client";

import { auth, provider } from "../lib/firebase";
import { signInWithPopup } from "firebase/auth";
import Cookies from "universal-cookie";

const cookies = new Cookies();

export const Auth = ({ setIsAuth }: { setIsAuth: (val: boolean) => void }) => {
    const signInWithGoogle = async () => {
        const result = await signInWithPopup(auth, provider);
        cookies.set("auth-token", result.user.refreshToken);
        setIsAuth(true);
    };

    return (
        <div>
            <p>Sign in with Google</p>
            <button onClick={signInWithGoogle}>Sign In</button>
        </div>
    );
};
