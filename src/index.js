const express = require('express')
const http = require('http')
const path = require('path')
const socketio = require('socket.io')
const Filter = require('bad-words')
const { generateMessage, generateLocationMessage } = require('./utils/messages')
const { addUser, removerUser, getUser, getUsersInRoom } = require('./utils/users')

const app = express()
const server = http.createServer(app)
const io = socketio(server)

const port = process.env.PORT || 7000
app.use(express.static(path.join(__dirname, '../public')))



io.on('connection', (socket) => {
    console.log('New WebSocket Connection')

    socket.on('join', ({ username, room }, callback) => {
        const {error,user} = addUser({ id: socket.id , username, room})
        
        if(error){
            return callback(error)
        }

        socket.join(user.room)

        socket.emit('message', generateMessage('Admin','Welcome!'))
        socket.broadcast.to(user.room).emit('message', generateMessage('Admin',`${user.username} has Joined!`))

        io.to(user.room).emit('roomData',{
            room:user.room,
            users:getUsersInRoom(user.room)
        })

        callback()
    })

    socket.on('sendMessage', (message, callback) => {
        const getUserInfo = getUser(socket.id) 
        const filter = new Filter()
        filter.addWords('mc', 'lwde', 'chutiya', 'bsdk', 'lund')

        if (filter.isProfane(message)) {
            return callback('Profantiy/bad-words is not allowed!')
        }

        io.to(getUserInfo.room).emit('message', generateMessage(getUserInfo.username,message))
        callback()
    })

    socket.on('sendLocation', ({ latitude, longitude }, callback) => {
        const getUserInfo = getUser(socket.id)
        io.to(getUserInfo.room).emit('locationMessage', generateLocationMessage(getUserInfo.username,{ latitude, longitude }))
        callback()
    })

    socket.on('disconnect', () => {
        const user = removerUser(socket.id)

        if(user){
            io.to(user.room).emit('message', generateMessage('Admin',`${user.username} has left!`)) 
            io.to(user.room).emit('roomData',{
                room:user.room,
                users:getUsersInRoom(user.room)
            })
        }
    })
})

server.listen(port, () => {
    console.log(`Server is Running on port no ${port}!`)
})