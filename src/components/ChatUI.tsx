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
    doc,
    deleteDoc,
    updateDoc,
} from "firebase/firestore";

// ChatUI component for displaying and managing chat messages in a room
export default function ChatUI({ room }: { room: string }) {
    // State for input field
    const [input, setInput] = useState("");
    // State for messages array
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

    // Reference to the Firestore messages collection
    const messagesRef = collection(db, "messages");
    // State for editing message
    const [editingId, setEditingId] = useState<string | null>(null);
    const [editingText, setEditingText] = useState("");

    // Delete a message by id
    const deleteMessage = async (id: string) => {
        await deleteDoc(doc(db, "messages", id));
    };

    // Start editing a message
    const startEditing = (id: string, currentText: string) => {
        setEditingId(id);
        setEditingText(currentText);
    };

    // Save the edited message
    const saveEdit = async () => {
        if (!editingId || !editingText.trim()) return;
        await updateDoc(doc(db, "messages", editingId), { text: editingText });
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
        <div className="p-4">
            {/* Room title */}
            <div className="text-xl font-bold mb-4 dark:text-white">
                Welcome to room: {room}
            </div>

            {/* Messages list */}
            <div className="space-y-2 rounded p-4 h-96 overflow-y-auto shadow dark:shadow-white bg-white dark:bg-neutral-900">
                {messages.map((msg) => {
                    // Check if the message belongs to the current user
                    const isMine = auth.currentUser && msg.userId === auth.currentUser.uid;
                    // Check if this message is being edited
                    const isEditing = editingId === msg.id;
                    return (
                        <div
                            key={msg.id}
                            className="flex items-start space-x-2 text-black dark:text-white"
                        >
                            {/* User avatar */}
                            {msg.photoURL && (
                                <img
                                    src={msg.photoURL}
                                    alt="avatar"
                                    className="w-8 h-8 rounded-full"
                                />
                            )}
                            <div>
                                {/* Display name */}
                                <div className="text-sm font-semibold">{msg.displayName}</div>
                                <div>
                                    {/* Edit mode */}
                                    {isEditing ? (
                                        <>
                                            <input
                                                className="w-full p-1 text-black rounded"
                                                value={editingText}
                                                placeholder="Edit your message..."
                                                onChange={(e) => setEditingText(e.target.value)}
                                            />
                                            <div className="flex space-x-2 mt-1">
                                                <button onClick={saveEdit} className="text-green-600 text-sm">Save</button>
                                                <button onClick={cancelEdit} className="text-gray-400 text-sm">Cancel</button>
                                            </div>
                                        </>
                                    ) : (
                                        <>
                                            {/* Message text */}
                                            <div>{msg.text}</div>
                                            {/* Edit/Delete buttons for own messages */}
                                            {isMine && (
                                                <div className="flex space-x-2 mt-1">
                                                    <button onClick={() => startEditing(msg.id, msg.text)} className="text-blue-500 text-xs">Edit</button>
                                                    <button onClick={() => deleteMessage(msg.id)} className="text-red-500 text-xs">Delete</button>
                                                </div>
                                            )}
                                        </>
                                    )}
                                </div>
                                {/* Timestamp */}
                                {msg.createdAt && (
                                    <div className="text-xs text-gray-500">
                                        {msg.createdAt.toLocaleTimeString()}
                                    </div>
                                )}
                            </div>
                        </div>
                    );
                })}
                {/* Dummy div for scroll-to-bottom */}
                <div ref={messagesEndRef} />
            </div>

            {/* Message input form */}
            <form onSubmit={handleSubmit} className="flex mt-4">
                <input
                    type="text"
                    disabled={!!editingId}
                    placeholder="Type your message..."
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    className="flex-grow p-2 rounded text-black dark:text-white"
                />
                <button
                    type="submit"
                    disabled={!!editingId}
                    className="ml-2 px-4 py-2 bg-[#20e07d] rounded text-white"
                >
                    Send
                </button>
            </form>
        </div >
    );
}
