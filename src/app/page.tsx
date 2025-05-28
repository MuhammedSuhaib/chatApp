'use client';
import React, { useState } from 'react';

export default function Home() {
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<string[]>([]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;
    setMessages([...messages, input]);
    setInput('');
  };

  return (
    <div className="max-w-sm mx-auto px-4 space-y-4 dark:text-white text-black">
      <div className="text-xl font-bold dark:text-white">Welcome to: CyberDevs</div>
      <div className="space-y-2 rounded p-4 h-100 shadow-sm shadow-neutral-900 dark:shadow-sm dark:shadow-neutral-50">
        <ul>
          {messages.map((msg, i) => (
            <li className='text-black dark:text-white' key={i}>{msg}</li>
          ))}
        </ul>
      </div>
      <form onSubmit={handleSubmit} className="flex">
        <input
          type="text"
          placeholder="Type your message here..."
          value={input}//* to get the value of input Add value and onChange
          onChange={(e) => setInput(e.target.value)}
          className="flex-grow  p-2 rounded text-black dark:text-white"
        />
        <button type="submit" className="px-4 py-2 bg-[#20e07d] rounded">
          Send
        </button>
      </form>
    </div>
  );
}


// ? HOw to TAke userInput in PURe HTml ????
/**
<form onsubmit="handleSubmit(event)">
  <input type="text" id="userInput" placeholder="Type your message here..." />
  <button type="submit">Send</button>
</form>

<script>
  function handleSubmit(event) {
    event.preventDefault(); //!using dom       ⬇
    const input = document.getElementById('userInput').value;
    console.log(input); // or do anything with the input
  }
</script>

 */