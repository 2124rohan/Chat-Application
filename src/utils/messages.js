const moment = require('moment')
const generateMessage = (username, text)=>{
    return {
        username,
        text,
        createdAt: moment().format('h:mm a')
    }
}

const generateLocationMessage = (username,{latitude,longitude})=>{
    return {
        username,
        url:`https://google.com/maps?q=${latitude},${longitude}`,
        createdAt: moment().format('h:mm a')
    }
}

module.exports ={
    generateMessage,
    generateLocationMessage
}