"use client";

import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import Cookies from "universal-cookie";
import { Auth } from "@/components/Auth";
import { SignOutBtn } from "@/components/SignOutBtn";
import ChatUI from "@/components/ChatUI";

export default function RoomPage() {
    const params = useParams();
    const room = params.room as string;

    const [isAuth, setIsAuth] = useState(false);
    const cookies = new Cookies();

    useEffect(() => {
        const token = cookies.get("auth-token");
        if (token) setIsAuth(true);
    }, []);

    if (!isAuth) return <Auth setIsAuth={setIsAuth} />;

    return (
        <div className="p-4 space-y-4">
            <SignOutBtn setIsAuth={setIsAuth} />
            <ChatUI room={room} />
        </div>
    );
}