'use client'

import { useEffect, useState, useRef } from "react"
import { io, Socket } from "socket.io-client"

type Message = {
    id: string
    text: string
}

export default function Client() {
    const [messages, setMessages] = useState<Message[]>([])
    const [text, setText] = useState<string>('')
    const socketRef = useRef<Socket | null>(null)
    
    
    useEffect(() => {
        const socket = io('http://localhost:3000')
        socketRef.current = socket
        socket.on('connect', () => {
            console.log('Connected to Server: ', socket.id)
            
        })
        socket.on('message:new', (msg: Message) => {
            setMessages((prev) => [...prev, msg])
        })
        return () => {
            socket.disconnect()
            console.log('Disconnected from server')
        }
    }, [])

    
    const handleSendMessage = () => {
        console.log(`Click Soket = ${socketRef.current?.id}, Text = ${text}`)
        if (socketRef.current) {
            socketRef.current.emit('message:send', text)
            setText('')
        }
    }


    return (
        <div  border-red-500>   
            <input style={{border: '1px solid red'}} type="text" value={text} onChange={(e) => setText(e.target.value)} />
            <button style={{border: '1px solid red'}} onClick={handleSendMessage}>Send</button>
            {messages.map((m, i) => <div key={i}>{m.text}</div>)}
        </div>
    )
   
}