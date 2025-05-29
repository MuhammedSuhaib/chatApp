"use client";

import { useEffect, useRef, useState } from "react";
import { db, auth } from "@/lib/firebase";
import {
    addDoc,
    collection,
    onSnapshot,
    orderBy,
    query,
    serverTimestamp,
    where,
} from "firebase/firestore";

export default function ChatUI({ room }: { room: string }) {
    const [input, setInput] = useState("");
    const [messages, setMessages] = useState<
        {
            id: string;
            text: string;
            displayName: string;
            photoURL: string;
            createdAt: Date | null;
        }[]
    >([]);

    const messagesEndRef = useRef<HTMLDivElement | null>(null);

    const messagesRef = collection(db, "messages");

    useEffect(() => {
        const q = query(
            messagesRef,
            where("room", "==", room),
            orderBy("createdAt")
        );

        const unsub = onSnapshot(q, (snapshot) => {
            const msgs = snapshot.docs.map((doc) => {
                const data = doc.data();
                return {
                    id: doc.id,
                    text: data.text,
                    displayName: data.displayName || "Unknown",
                    photoURL: data.photoURL || "",
                    createdAt: data.createdAt?.toDate() || null,
                };
            });
            setMessages(msgs);
        });

        return () => unsub();
    }, [room]);

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!input.trim() || !auth.currentUser) return;

        await addDoc(messagesRef, {
            text: input,
            room,
            createdAt: serverTimestamp(),
            userId: auth.currentUser.uid,
            displayName: auth.currentUser.displayName,
            photoURL: auth.currentUser.photoURL,
        });

        setInput("");
    };

    return (
        <div className="p-4">
            <div className="text-xl font-bold mb-4 dark:text-white">
                Welcome to room: {room}
            </div>

            <div className="space-y-2 rounded p-4 h-96 overflow-y-auto shadow dark:shadow-white bg-white dark:bg-neutral-900">
                {messages.map((msg) => (
                    <div
                        key={msg.id}
                        className="flex items-start space-x-2 text-black dark:text-white"
                    >
                        {msg.photoURL && (
                            <img
                                src={msg.photoURL}
                                alt="avatar"
                                className="w-8 h-8 rounded-full"
                            />
                        )}
                        <div>
                            <div className="text-sm font-semibold">{msg.displayName}</div>
                            <div>{msg.text}</div>
                            {msg.createdAt && (
                                <div className="text-xs text-gray-500">
                                    {msg.createdAt.toLocaleTimeString()}
                                </div>
                            )}
                        </div>
                    </div>
                ))}
                <div ref={messagesEndRef} />
            </div>

            <form onSubmit={handleSubmit} className="flex mt-4">
                <input
                    type="text"
                    placeholder="Type your message..."
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    className="flex-grow p-2 rounded text-black dark:text-white"
                />
                <button
                    type="submit"
                    className="ml-2 px-4 py-2 bg-[#20e07d] rounded text-white"
                >
                    Send
                </button>
            </form>
        </div>
    );
}
