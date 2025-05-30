"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function RoomsPage() {
    const [room, setRoom] = useState("");
    const [joinedRooms, setJoinedRooms] = useState<string[]>([]);
    const router = useRouter();

    // Load saved rooms from localStorage on mount
    useEffect(() => {
        const saved = localStorage.getItem("joinedRooms");
        if (saved) {
            setJoinedRooms(JSON.parse(saved));
        }
    }, []);

    // Save rooms to localStorage whenever list changes
    useEffect(() => {
        localStorage.setItem("joinedRooms", JSON.stringify(joinedRooms));
    }, [joinedRooms]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const trimmed = room.trim();
        if (!trimmed) return;

        // Save locally if not already joined
        if (!joinedRooms.includes(trimmed)) {
            setJoinedRooms((prev) => [...prev, trimmed]);
        }

        // Navigate
        router.push(`/rooms/${trimmed}`);
        setRoom("");
    };

    return (
        <div className="p-6 space-y-4">
            <h1 className="text-xl font-bold">Enter a Chat Room</h1>

            <form onSubmit={handleSubmit} className="flex flex-col space-y-2">
                <input
                    value={room}
                    onChange={(e) => setRoom(e.target.value)}
                    placeholder="Enter room name"
                    className="border p-2 rounded text-black"
                />
                <button type="submit" className="bg-blue-500 px-4 py-2 rounded text-white">
                    Join Room
                </button>
            </form>

            <div>
                <h2 className="text-lg font-bold">Your Rooms</h2>
                {joinedRooms.length === 0 ? (
                    <p className="text-sm text-gray-500">No rooms yet.</p>
                ) : (
                    <ul className="list-disc pl-4">
                        {joinedRooms.map((r) => (
                            <li key={r}>
                                <a href={`/rooms/${r}`} className="text-blue-600 underline">
                                    {r}
                                </a>
                            </li>
                        ))}
                    </ul>
                )}
            </div>
        </div>
    );
}
