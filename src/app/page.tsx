"use client";

import { useEffect, useState } from "react";
import Cookies from "universal-cookie";
import { SignOutBtn } from "@/components/SignOutBtn";
import { Auth } from "@/components/Auth";
import ChatUI from "@/components/ChatUI";

const cookies = new Cookies();

export default function HomePage() {
  const [isAuth, setIsAuth] = useState(false);
  const [isInChat, setIsInChat] = useState(false);
  const [room, setRoom] = useState("");

  useEffect(() => {
    const token = cookies.get("auth-token");
    if (token) setIsAuth(true);
  }, []);

  if (!isAuth) return <Auth setIsAuth={setIsAuth} />;

  return (
    <div className="p-6">
      <SignOutBtn setIsAuth={setIsAuth} />
      {!isInChat ? (
        <div className="flex flex-col items-center space-y-4">
          <label className="text-lg">Type room name:</label>
          <input
            onChange={(e) => setRoom(e.target.value)}
            className="border p-2 rounded"
            placeholder="Enter room name"
          />
          <button
            onClick={() => setIsInChat(true)}
            className="px-4 py-2 bg-blue-500 rounded"
          >
            Enter Chat
          </button>
        </div>
      ) : (
        <ChatUI room={room} />
      )}

      <div>
        <h2 className="text-lg">Active Rooms:</h2>
        <ul>
          <li>{room}</li>
        </ul>
      </div>
    </div>
  );
}
