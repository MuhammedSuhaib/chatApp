"use client";
import { useRouter } from "next/navigation";
import { useState } from "react";

function HomePage() {
    const [room, setRoom] = useState('');
    const router = useRouter();

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!room.trim()) return;
        router.push(`/${room}`);
    };

    return (
        <form onSubmit={handleSubmit} className="flex flex-col items-center space-y-4">
            <label className="text-lg">Type room name:</label>
            <input
                value={room}
                onChange={(e) => setRoom(e.target.value)}
                className="border p-2 rounded"
                placeholder="enter the room here ..."
            />
            <button
                type="submit"
                className="px-4 py-2 bg-blue-500 rounded"
            >
                Enter Chat
            </button>
        </form>
    );
}

export default HomePage;
