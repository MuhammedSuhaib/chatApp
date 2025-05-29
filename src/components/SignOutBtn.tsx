import { signOut } from "firebase/auth";
import { auth } from "../lib/firebase";
import Cookies from "universal-cookie";

const cookies = new Cookies();

export const SignOutBtn = ({ setIsAuth }: { setIsAuth: (val: boolean) => void }) => {
    const signUserOut = async () => {
        await signOut(auth);
        cookies.remove("auth-token");
        setIsAuth(false);
    };

    return <button onClick={signUserOut}>Sign Out</button>;
};
