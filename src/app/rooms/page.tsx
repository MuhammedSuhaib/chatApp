import Link from "next/link";

export default function RoomsPage() {
    return (
        <div className="p-6 space-y-4">
            <h1 className="text-xl font-bold">Enter a Chat Room</h1>
            <form
                action={(formData) => {
                    const room = formData.get("room")?.toString().trim();
                    if (room) window.location.href = `/rooms/${room}`;
                }}
                className="flex flex-col space-y-2"
            >
                <input
                    name="room"
                    placeholder="Enter room name"
                    className="border p-2 rounded text-black"
                />
                <button type="submit" className="bg-blue-500 px-4 py-2 rounded text-white">
                    Join Room
                </button>
            </form>
            <Link href="/">← Back</Link>
        </div>
    );
}
