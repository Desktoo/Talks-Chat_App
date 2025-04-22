import express from "express"
import { Server } from "socket.io"
import http from "http"

const app = express()
const server = http.createServer(app)

const socketio = new Server(server, {
    cors: {
        origin: ["http://localhost:5173"]
    }
})

export function getRecieverSocketId(userId) {
    return userSocketMap[userId]
}

// used to store online users
const userSocketMap = {} // { userId: socketId }

socketio.on("connection", (socket) => {
    console.log("A User connected", socket.id)

    const userId = socket.handshake.query.userId
    if(userId) userSocketMap[userId] = socket.id

    socketio.emit("getOnlineUsers", Object.keys(userSocketMap))

    socket.on("disconnect", () => {
        console.log("A user disconnected", socket.id)
        delete userSocketMap[userId]
        socketio.emit("getOnlineUsers", Object.keys(userSocketMap))
    })
})

export { socketio, app, server }