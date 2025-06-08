"use client";
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover";
import { useEffect, useRef, useState } from "react";
import { db, auth } from "@/lib/firebase";
import {
    addDoc,
    collection,
    onSnapshot,
    orderBy,
    query,
    serverTimestamp,
    doc,
    deleteDoc,
    updateDoc,
} from "firebase/firestore";
import { Send } from "lucide-react";

type Message = {
    id: string;
    text: string;
    displayName: string;
    photoURL: string;
    createdAt: Date | null;
    userId?: string;
};

export default function ChatUI({ room }: { room: string }) {
    const [input, setInput] = useState("");
    const [messages, setMessages] = useState<Message[]>([]);
    const [editingId, setEditingId] = useState<string | null>(null);
    const [editingText, setEditingText] = useState("");

    const messagesEndRef = useRef<HTMLDivElement | null>(null);
    const messagesRef = collection(db, "rooms", room, "messages");

    // Scroll to bottom on new messages
    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages]);

    // Subscribe to Firestore messages
    useEffect(() => {
        const q = query(messagesRef, orderBy("createdAt"));
        const unsub = onSnapshot(q, (snapshot) => {
            const msgs = snapshot.docs.map((doc) => {
                const data = doc.data();
                return {
                    id: doc.id,
                    text: data.text,
                    displayName: data.displayName || "Unknown",
                    photoURL: data.photoURL || "",
                    createdAt: data.createdAt?.toDate ? data.createdAt.toDate() : null,
                    userId: data.userId,
                };
            });
            setMessages(msgs);
        });
        return () => unsub();
    }, [room]);

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

    const deleteMessage = async (id: string) => {
        await deleteDoc(doc(db, "rooms", room, "messages", id));
    };

    const startEditing = (id: string, text: string) => {
        setEditingId(id);
        setEditingText(text);
    };

    const saveEdit = async () => {
        if (!editingId || !editingText.trim()) return;
        await updateDoc(doc(db, "rooms", room, "messages", editingId), {
            text: editingText,
        });
        setEditingId(null);
        setEditingText("");
    };

    const cancelEdit = () => {
        setEditingId(null);
        setEditingText("");
    };

    return (
        <div className="flex flex-col max-w-xl mx-auto h-[100dvh] px-3 sm:px-6 py-4 bg-white dark:bg-neutral-900 rounded-lg shadow-lg dark:shadow-white/20">

            {/* Room header */}
            <header className="text-2xl font-extrabold text-gray-900 dark:text-white border-b border-gray-300 dark:border-gray-700 pb-2 mb-2">
                Room: <span className="text-[#20e07d]">{room}</span>
            </header>

            {/* Scrollable messages */}
            <main className="flex-1 overflow-y-auto space-y-4 p-2 rounded-lg bg-gradient-to-b from-white to-gray-100 dark:from-[#1a1441] dark:to-[#0d0c1d]">
                {messages.map((msg) => {
                    const isMine = auth.currentUser?.uid === msg.userId;
                    const isEditing = editingId === msg.id;

                    return (
                        <div
                            key={msg.id}
                            className={`flex items-end space-x-2 text-gray-900 dark:text-gray-100 ${isMine ? "justify-end" : "justify-start"}`}
                        >
                            <div className={`relative max-w-[80%] sm:max-w-[70%] ${isMine ? "bg-[#20e07d]/20" : "bg-gray-200 dark:bg-neutral-700"} p-3 rounded-xl shadow-sm`}>

                                <div className="mb-1">
                                    {!isMine && msg.photoURL && (
                                        <div className="flex  gap-3 items-center ">
                                            <img
                                                src={msg.photoURL}
                                                alt="avatar"
                                                className="size-6 rounded-full shadow-md shadow-[#8B5CF6]"
                                            />
                                            <span className="text-sm text-[#8B5CF6]">{msg.displayName}</span>
                                        </div>
                                    )}
                                    {isMine && !isEditing && (
                                        <Popover>
                                            <PopoverTrigger>
                                                {isMine && msg.photoURL && (
                                                    <div className="flex justify-end-safe gap-3 items-center ">
                                                        <span className=" text-sm text-[#3f60f4]">{msg.displayName}</span>
                                                        <img
                                                            src={msg.photoURL}
                                                            alt="avatar"
                                                            className="size-6 rounded-full shadow-md shadow-[#3f60f4]"
                                                        />
                                                    </div>
                                                )}
                                            </PopoverTrigger>
                                            <PopoverContent className="size-fit">
                                                <button
                                                    onClick={() => startEditing(msg.id, msg.text)}
                                                    className="w-full text-left px-3 py-2 text-sm hover:bg-gray-100 dark:hover:bg-neutral-700"
                                                >
                                                    Edit
                                                </button>
                                                <button
                                                    onClick={() => deleteMessage(msg.id)}
                                                    className="w-full text-left px-3 py-2 text-sm text-red-500 hover:bg-gray-100 dark:hover:bg-neutral-700"
                                                >
                                                    Delete
                                                </button>
                                            </PopoverContent>
                                        </Popover>
                                    )}
                                </div>

                                {isEditing ? (
                                    <>
                                        <input
                                            className="w-full p-2 mt-1 rounded-md border border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#20e07d]"
                                            value={editingText}
                                            placeholder="Edit your message..."
                                            onChange={(e) => setEditingText(e.target.value)}
                                        />
                                        <div className="flex space-x-3 mt-2 justify-end text-sm">
                                            <button onClick={saveEdit} className="text-green-600 hover:underline font-semibold">
                                                Save
                                            </button>
                                            <button onClick={cancelEdit} className="text-gray-400 hover:underline font-semibold">
                                                Cancel
                                            </button>
                                        </div>
                                    </>
                                ) : (
                                    <>
                                        <p className="whitespace-pre-wrap break-words text-sm">{msg.text}</p>
                                        <span className="block mt-1 text-xs text-gray-500 dark:text-gray-400">
                                            {msg.createdAt?.toLocaleTimeString()}
                                        </span>
                                    </>
                                )}
                            </div>
                        </div>
                    );
                })}
                <div ref={messagesEndRef} />
            </main>



            {/* Chat input stuck at bottom */}
            <form
                onSubmit={handleSubmit}
                className="flex items-center gap-2 pt-2"
            >
                <textarea
                    rows={1}
                    placeholder="Type your message..."
                    value={input}
                    onChange={(e) => {
                        setInput(e.target.value);
                        e.target.style.height = "auto";
                        e.target.style.height = `${Math.min(e.target.scrollHeight, 120)}px`;
                    }}
                    onKeyDown={(e) => {
                        if (e.key === "Enter" && !e.shiftKey) {
                            e.preventDefault();
                            handleSubmit(e);
                        }
                    }}
                    className="flex-grow resize-none overflow-hidden text-sm px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 text-black dark:text-white focus:outline-none focus:ring-2 focus:ring-[#20e07d] max-h-[120px]"
                />

                <button
                    type="submit"
                    disabled={!!editingId}
                    aria-label="Send"
                    title="Send"
                    className="flex-shrink-0 p-1 rounded-full"
                >
                    <Send />
                </button>
            </form>
        </div>
    );
}
