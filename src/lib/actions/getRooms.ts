import { db } from "@/lib/firebase";
import { collection, getDocs } from "firebase/firestore";

export async function getRooms() {
    const snapshot = await getDocs(collection(db, "rooms"));
    return snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
}
