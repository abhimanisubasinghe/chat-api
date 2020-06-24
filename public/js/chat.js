const socket = io()

const $msgForm = document.querySelector('#msgForm')
const $sendLocation = document.querySelector('#send-location')
const $txt = document.querySelector('#txt')

const $msgFormInput = $msgForm.querySelector('input')
const $msgFormButton = $msgForm.querySelector('button')
const $msgs = document.querySelector('#msgs')
const $locations = document.querySelector('#locations')
const $sidebar = document.querySelector('#sidebar')

//Templates
const msgTemplate = document.querySelector('#msg-template').innerHTML
const locationTemplate = document.querySelector('#location-template').innerHTML
const sidebarTemplate = document.querySelector('#sidebar-template').innerHTML


//options
const {username, room} = Qs.parse(location.search, {ignoreQueryPrefix: true}) 

const autoscroll = () =>{
    //new message element
    const $newMsg = $msgs.lastElementChild

    //height of the new msg
    const newMsgStyles = getComputedStyle($newMsg)
    const newMsgMargin = parseInt(newMsgStyles.marginBottom)
    const newMsgHeight = $newMsg.offsetHeight + newMsgMargin

    //Visible height
    const visibleHeight = $msgs.offsetHeight

    //Height of messsages container
    const containerHeight = $msgs.scrollHeight

    //How far have I scrolled?
    const scrollOffset = $msgs.scrollTop + visibleHeight

    if(containerHeight - newMsgHeight <= scrollOffset){
        $msgs.scrollTop = $msgs.scrollHeight
    }


}

socket.on('message', (msg) => {
    console.log(msg)
    const html = Mustache.render(msgTemplate,{
        username: msg.username,
        msg : msg.text,
        createdAt: moment(msg.createdAt).format('h:mm a')
    })
    $msgs.insertAdjacentHTML('beforeend',html)
    autoscroll()
})

socket.on('locationMsg', (location) => {
    console.log(location)
    const html = Mustache.render(locationTemplate,{
        username: location.username,
        url : location.url,
        createdAt: moment(location.createdAt).format('h:mm a')
    })
    $msgs.insertAdjacentHTML('beforeend',html)
    autoscroll()
})

socket.on('roomData', ({room, users}) => {
    const html = Mustache.render(sidebarTemplate,{
        room,
        users
    })
    $sidebar.innerHTML = html
})

$msgForm.addEventListener('submit',(e) => {
    e.preventDefault();
    //console.log("clicked")
    $msgFormButton.setAttribute('disabled','disabled')
    const message = e.target.elements.txt.value
    if(message){
        socket.emit('sendMsg', message,(message) => {
            $msgFormButton.removeAttribute('disabled')
            $msgFormInput.value = ''
            $msgFormInput.focus()

            if(message){
                console.log('Message delivered! ',message)
            }
            else{
                console.log('Message dilivered!')
            }
            
        })
    }
    else{
        $msgFormButton.removeAttribute('disabled')
        console.log('Enter a msg to be send')
    }

})

$sendLocation.addEventListener('click', () => {
    $sendLocation.setAttribute('disabled','disabled')
    if(!navigator.geolocation){
        $sendLocation.removeAttribute('disabled')
        return alert('GeoLocation is not supported by your browser')
    }
    navigator.geolocation.getCurrentPosition((possition) => {
        //console.log(possition.coords.latitude)
        $sendLocation.removeAttribute('disabled')

        socket.emit('sendLocation', {
            latitude: possition.coords.latitude, 
            longitude: possition.coords.longitude}, (msg) => {
                console.log(msg)
            })

    })
})

socket.emit('join',{username,room},(error) => {
    if(error){
        alert(error)
        location.href = '/'
    }
})