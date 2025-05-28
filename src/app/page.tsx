
export default function Home() {
  return (
  <div className="space-y-4 text-black">
      <div className="text-xl font-bold">Welcome to: CyberDevs</div>
      <div className="space-y-2 rounded p-4 h-100 shadow">
      </div>
      <form  className="flex">
        <input
          type="text"
          placeholder="Type your message here..."
          className="flex-grow  p-2 rounded text-black"
        />
        <button type="submit" className="px-4 py-2 bg-green-500 rounded">
          Send
        </button>
      </form>
    </div>
  );
}
