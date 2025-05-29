import ChatUI from "@/components/ChatUI";

type Props = {
  params: { room: string };
};

export default function RoomPage({ params }: Props) {
  return <ChatUI />;
}
