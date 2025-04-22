import cloudinary from "../lib/cloudinary.js"
import { getRecieverSocketId, socketio } from "../lib/socket.js"
import Message from "../models/messageModel.js"
import User from "../models/userModel.js"

export const getUsersForSidebar = async (req, res) => {
    try {
        const loggerInUserId = req.user._id
        const filteredUsers = await User.find({ _id: {$ne: loggerInUserId}}).select("-password")

        res.status(200).json(filteredUsers)
    } catch (error) {
        console.error("Error in getUserForSidebar: ", error.message)
        res.status(500).json({ error: "Internal Server Error" })
    }
}

export const getMessages = async (req, res) => {
    try {
        const { id: userToChatId } = req.params
        const myId = req.user._id

        const messages = await Message.find({
           $or: [
            {senderId: myId, recieverId: userToChatId},
            {senderId: userToChatId, recieverId: myId}
           ] 
        })

        res.status(200).json(messages)
    } catch (error) {
        console.log("Error in getMessages controller: ", error.message)
        res.status(500).json({ message: "Internal Server Error" })
    }
}

export const sendMessage = async (req, res) => {
    try {
        const { text, image } = req.body
        const { id: recieverId } = req.params
        const senderId = req.user._id

        let imageUrl

        if(image){
            const uploadRes = await cloudinary.uploader.upload(image)
            imageUrl = uploadRes.secure_url
        }

        const newMessage = new Message({
            senderId,
            recieverId,
            text,
            image: imageUrl
        })

        await newMessage.save()

        const recieverSocketId = getRecieverSocketId(recieverId)
        if(recieverSocketId){
            socketio.to(recieverSocketId).emit("newMessage", newMessage)
        }

        res.status(201).json(newMessage)
    } catch (error) {
        console.log("Error in sendMessage Controller: ", error.message)
        res.status(500).json({ message: "Internal Server Error"})
    }
}