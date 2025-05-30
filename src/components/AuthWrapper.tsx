"use client";

import { useEffect, useState } from "react";
import Cookies from "universal-cookie";
import { Auth } from "./Auth";

const cookies = new Cookies();

export function AuthWrapper({ children }: { children: React.ReactNode }) {
    const [isAuth, setIsAuth] = useState(false);

    useEffect(() => {
        const token = cookies.get("auth-token");
        if (token) setIsAuth(true);
    }, []);

    if (!isAuth) return <Auth setIsAuth={setIsAuth} />;
    return <>{children}</>;
}
