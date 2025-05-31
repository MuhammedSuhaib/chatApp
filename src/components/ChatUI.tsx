"use client";
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover"
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
import Image from "next/image";

// ChatUI component for displaying and managing chat messages in a room
export default function ChatUI({ room }: { room: string }) {
    const [input, setInput] = useState("");
    const [messages, setMessages] = useState<
        {
            id: string;
            text: string;
            displayName: string;
            photoURL: string;
            createdAt: Date | null;
            userId?: string;
        }[]
    >([]);

    // Ref for scrolling to the latest message
    const messagesEndRef = useRef<HTMLDivElement | null>(null);

    // Reference to the Firestore messages subcollection for the current room
    const messagesRef = collection(db, "rooms", room, "messages");
    // State for editing message
    const [editingId, setEditingId] = useState<string | null>(null);
    const [editingText, setEditingText] = useState("");

    // Delete a message by id
    const deleteMessage = async (id: string) => {
        await deleteDoc(doc(db, "rooms", room, "messages", id));
    };

    // Start editing a message
    const startEditing = (id: string, currentText: string) => {
        setEditingId(id);
        setEditingText(currentText);
    };

    // Save the edited message
    const saveEdit = async () => {
        if (!editingId || !editingText.trim()) return;
        await updateDoc(doc(db, "rooms", room, "messages", editingId), { text: editingText });
        setEditingId(null);
        setEditingText("");
    };

    // Cancel editing
    const cancelEdit = () => {
        setEditingId(null);
        setEditingText("");
    };

    // Listen for new messages in the current room
    useEffect(() => {
        const q = query(
            messagesRef,
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
                    createdAt: data.createdAt?.toDate ? data.createdAt.toDate() : null,
                    userId: data.userId,
                };
            });
            setMessages(msgs);
        });

        return () => unsub();
    }, [room]);

    // Scroll to the latest message when messages change
    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages]);

    // Handle sending a new message
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
        <div className="p-6 max-w-xl mx-auto bg-white dark:bg-neutral-900 rounded-lg shadow-lg dark:shadow-white/20">
            {/* Room title */}
            <div className="text-2xl font-extrabold mb-6 text-gray-900 dark:text-white border-b border-gray-300 dark:border-gray-700 pb-3">
                Room: <span className="text-[#20e07d]">{room}</span>
            </div>

            {/* Messages list */}
            <div className="space-y-4 p-4 h-96 overflow-y-auto rounded-lg shadow-inner bg-[radial-gradient(circle_at_center,_#ffffff,_#e5e7eb)] dark:bg-[radial-gradient(circle_at_center,_#1a1441,_#0d0c1d)] dark:text-white">


                {messages.map((msg) => {
                    const isMine = auth.currentUser && msg.userId === auth.currentUser.uid;
                    const isEditing = editingId === msg.id;
                    return (
                        <div
                            key={msg.id}
                            className={`flex items-end space-x-2 text-gray-900 dark:text-gray-100 ${isMine ? "justify-end" : "justify-start"}`}
                        >
                            <div className={`relative max-w-[80%] sm:max-w-[70%] ${isMine ?   "bg-[#20e07d]/20" : "bg-gray-200 dark:bg-neutral-700"} p-3 rounded-xl shadow-sm`}>
                                <div className="flex justify-center gap-3 items-center mb-1">
                                    <span className="font-semibold text-sm">{msg.displayName}</span>
                                    {!isMine && msg.photoURL && (
                                        <img
                                            src={msg.photoURL}
                                            alt="avatar"
                                            className="size-6 rounded-full shadow-md shadow-[#208ae0]"
                                        />
                                    )}
                                    {isMine && !isEditing && (
                                        <Popover>
                                            <PopoverTrigger>
                                                {isMine && msg.photoURL && (
                                                    <img
                                                        src={msg.photoURL}
                                                        alt="avatar"
                                                        className="size-6 rounded-full shadow-md shadow-[#208ae0]"
                                                    />
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
            </div>
            {/* Message input form */}
            <form onSubmit={handleSubmit} className="flex mt-6 gap-3">
                {/* type msg*/}
                <input
                    type="text"
                    disabled={!!editingId}
                    placeholder="      Type your message..."
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    className="flex-grow size-xs rounded-4xl border border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#20e07d] "
                />
                {/* send button ⇗ */}
                <button
                    type="submit"
                    disabled={!!editingId}
                    aria-label="Send"
                    title="Send"
                >
                    <Image
                        src="/send.png"
                        width={512}
                        height={512}
                        alt="send"
                        className="size-7 pointer-events-none"
                    />
                </button>
            </form>
        </div>

    );
}
