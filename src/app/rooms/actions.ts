"use server";

import { redirect } from "next/navigation";

export async function joinRoom(formData: FormData) {
const room = formData.get("room")?.toString().trim();
if (!room) return;
redirect(`/rooms/${room}`);
}