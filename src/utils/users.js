const users = []

//add User

const addUser = ({id ,username, room}) =>{
    //Clean the data
    username = username.trim().toLowerCase()
    room = room.trim().toLowerCase()

    //validate the data
    if(!username || !room){
        return {
            error : 'Username and room are required'
        }
    }

    //check for existing user
    const existingUser = users.find((user) => {
        return user.room === room && user.username === username
    })

    //validate username
    if(existingUser) {
        return{
            error: 'Username is in use!'
        }
    }

    //Store user
    const user = { id, username, room}
    users.push(user)
    return {user}
}

const removeUser = ( id ) => {
    const index = users.findIndex((user) => {
        return user.id === id
    })

    if(index !== -1){
        return users.splice(index, 1)[0]
    }
}

const getUser = (id) => {
    const foundUser = users.find((user) => {
        return user.id === id
    })

    if(foundUser){
        return foundUser
    }
    else{
        return 'no such user'
    }
}

const getUsersInRoom = (room) => {
    const usersInRoom = users.filter((user) =>{
        return user.room === room
    })

    if(usersInRoom.length!= 0){
        return usersInRoom
    }
    else{
        return 'no such room'
    }
}

module.exports = {
    addUser,
    removeUser,
    getUser,
    getUsersInRoom
}