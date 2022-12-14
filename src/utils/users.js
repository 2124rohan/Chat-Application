const users = []

const addUser = ({id, username, room}) => {    

    // Validate the data
    if(!username || !room){
        return {
            error: 'Username and room no is required!'
        }
    }

    // Check for existing user
    const existingUser = users.find((user)=>{
       return user.room === room && user.username === username 
    })

    // Validate username
    if(existingUser){
        return{
            error: 'username is in use!'
        }
    }

    // Store user
    const user = {id,username,room}
    users.push(user)
    return {user}
}

const removerUser = (id)=>{
    const index = users.findIndex((user)=> user.id === id)

    if(index !== -1){
        return users.splice(index,1)[0]
    }
}

const getUser = (id)=>{
   return users.find((user)=> user.id === id)
}

const getUsersInRoom = (room)=>{
    return users.filter((user)=> user.room === room)
}

module.exports ={
    addUser,
    removerUser,
    getUser,
    getUsersInRoom
}
