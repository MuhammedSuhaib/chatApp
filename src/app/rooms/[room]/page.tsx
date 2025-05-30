"use client";

import { useParams } from "next/navigation";
import ChatUI from "@/components/ChatUI";

export default function RoomPage() {
    const params = useParams();
    const room = params.room as string;

    return (
        <div className="p-4">
            <ChatUI room={room} />
        </div>
    );
}
