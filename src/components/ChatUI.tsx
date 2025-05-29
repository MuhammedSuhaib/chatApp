"use client";

import React, { useState } from "react";

export default function ChatUI({ room }: { room: string }) {
    const [input, setInput] = useState("");
    const [messages, setMessages] = useState<string[]>([]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!input.trim()) return;
        setMessages([...messages, input]);
        setInput("");
    };

    return (
        <div>
            <div className="text-xl font-bold dark:text-white">Welcome to room: {room}</div>
            <div className="space-y-2 rounded p-4 h-100 shadow dark:shadow-white">
                <ul>
                    {messages.map((msg, i) => (
                        <li className="text-black dark:text-white" key={i}>{msg}</li>
                    ))}
                </ul>
            </div>
            <form onSubmit={handleSubmit} className="flex">
                <input
                    type="text"
                    placeholder="Type your message here..."
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    className="flex-grow p-2 rounded text-black dark:text-white"
                />
                <button type="submit" className="px-4 py-2 bg-[#20e07d] rounded">Send</button>
            </form>
        </div>
    );
}
