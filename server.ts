import next from 'next'
import {createServer} from 'http'
import {Server} from 'socket.io'

const dev = process.env.NODE_ENV !== 'production'

const app = next({dev})

// Handler for request / response handling of nextjs
const handler = app.getRequestHandler()

// Create a HTTP Server
const httpServer = createServer((req, res) => {
    if(req.url === '/health') {
        res.statusCode = 200
        res.setHeader('Content-Type', 'application/json')
        res.end(JSON.stringify({status: 'ok'}))
        return
    }
    handler(req, res)   
}) 

// Create a Socket.IO Server
// PingPong: PingInterval: 25000ms, PingTimeout: 20000ms - Heartbeat to detect disconnection (explicit for better understanding)
const io = new Server(httpServer, {pingInterval: 25000, pingTimeout: 20000})

// Prepare the app for handling requests
app.prepare().then(() => {
    // Handle socket connections
    io.on('connection', (socket) => {
        console.log(`Socket Connetected: ${socket.id}`)
        socket.on('message:send', (text) => {
            io.emit('message:new', {id: socket.id, text})
            console.log(`Message Sent: ${text}`)
           
        })
    })
    io.on('error', (socketError) => {
        console.error('Error: ', socketError)
    })
    httpServer.listen("3000")
    console.log('Server is listening on port 3000')
})




