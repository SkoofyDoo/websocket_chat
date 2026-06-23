import next from 'next'
import {createServer} from 'http'
import {Server} from 'socket.io'

const dev = process.env.NODE_ENV !== 'production'
const app = next({dev})
const handler = app.getRequestHandler()

const httpServer = createServer(handler) 

const io = new Server(httpServer)

app.prepare().then(() => {
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


