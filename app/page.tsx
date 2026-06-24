'use client'
import Client from "./client";

import {useState} from 'react'
import {useRouter} from 'next/navigation'

export default function Home() {
  
  const router = useRouter()
  const [room, setRoom] = useState<string>('')
  const [name, setName] = useState<string>('')
  
  return (
    <div className="flex flex-col flex-1 items-center justify-center bg-zinc-50 font-sans ">
      <main className="flex flex-1 w-full max-w-3xl flex-col items-center justify-between py-32 px-16 bg-white dark:bg-black sm:items-start">
      <button onClick={() => router.push(`/room/${room}?name=${encodeURIComponent(name)}`)}>Create Room</button>
      <input type="text" value={room} onChange={(e) => setRoom(e.target.value)} placeholder="Room ID" />
      <input type="text" value={name} onChange={(e) => setName(e.target.value)} placeholder="Name" />
        
      </main>
    </div>
  );
}
