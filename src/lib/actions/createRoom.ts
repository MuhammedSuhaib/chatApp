import { db } from "@/lib/firebase";
import { addDoc, collection, serverTimestamp } from "firebase/firestore";

export async function createRoom(name: string, userId: string) {
    await addDoc(collection(db, "rooms"), {
        name,
        createdBy: userId,
        createdAt: serverTimestamp(),
    });
} 
