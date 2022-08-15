const socket = io()

//Elements
const $mesasgeForm = document.querySelector('form')
const $msgFormInput = document.getElementById('message')
const $mesasgeFormButton = document.getElementById("send")
const $locationButton = document.getElementById('send-location')
const $mesasges = document.getElementById('messages')
const $siderbar = document.getElementById('sidebar')

//Temaplates
const $mesasgeTemplate = document.getElementById('message-template').innerHTML
const $locationTemplate = document.getElementById('location-template').innerHTML
const $sidebarTemplate = document.getElementById('sidebar-template').innerHTML

//Option
const { username, room } = Qs.parse(location.search, { ignoreQueryPrefix: true })

const actoscroll = ()=>{
    // New message element
    const $newMessage = $mesasges.lastElementChild

    // Height of the new message
    const $newMessageStyle = getComputedStyle($newMessage)
    const $newMessageMargin = parseInt($newMessageStyle.marginBottom)
    const $newMessageHeight = $newMessage.offsetHeight + $newMessageMargin  
     
   // Visible height
   const $visibleHeight = $mesasges.offsetHeight

   // Height of messages container
   const $containerHeight = $mesasges.scrollHeight
  
   // How far have i scrolled?
   const $scrollOffset = $mesasges.scrollTop + $visibleHeight   
   if($containerHeight - $newMessageHeight <= $scrollOffset){
         $mesasges.scrollTop = $mesasges.scrollHeight
   }
   
}

socket.on('message', (data) => {
    console.log(data)
    const html = Mustache.render($mesasgeTemplate, {
        username: data.username,
        message: data.text,
        createdAt: data.createdAt,
    })
    $mesasges.insertAdjacentHTML('beforeend', html)
    actoscroll()
})

socket.on('locationMessage', (location) => {
    console.log(location)
    const html = Mustache.render($locationTemplate, {
        username:location.username,
        location: location.url,
        createdAt: location.createdAt
    })
    $mesasges.insertAdjacentHTML('beforeend', html)
    actoscroll()
})

socket.on('roomData', ({room,users})=>{
    const html = Mustache.render($sidebarTemplate,{
        room,
        users
    })
    $siderbar.innerHTML = html
})

$mesasgeForm.addEventListener('submit', (e) => {
    e.preventDefault()

    //disabled the send button 
    $mesasgeFormButton.setAttribute('disabled', 'disabled')

    const mesasge = $msgFormInput.value;

    socket.emit('sendMessage', mesasge, (error) => {
        //enable the send button
        $mesasgeFormButton.removeAttribute('disabled')
        $msgFormInput.value = ''
        $msgFormInput.focus()
        if (error) {
            return console.log(error)
        }
        console.log('message Delivered!')
    })
})

$locationButton.addEventListener('click', () => {
    if (!navigator.geolocation) {
        return alert('Geolocation Not Supported by Your Browsr :(')
    }

    //disable the location button
    $locationButton.setAttribute('disabled', 'disabled')
    navigator.geolocation.getCurrentPosition((position) => {
        latitude = position.coords.latitude
        longitude = position.coords.longitude

        $locationButton.removeAttribute('disabled')
        socket.emit('sendLocation', { latitude, longitude }, () => {
            console.log('Location Shared!')
        })
    })
})

socket.emit('join', { username, room }, (error) => {
    if (error) {
        alert(error)
        location.href = '/'
    }
})


