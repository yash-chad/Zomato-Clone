const socket = io()
const status = document.getElementById('status')
const messages = document.getElementById('messages')
const textarea = document.getElementById('textarea')
const formSubmit = document.getElementById('form_submit')

//Options --This is the qs library whose link we've included in the html file
//location.search is a browser side tool which gives us the querystring
//eg : ?username=yashchachad1&room=myroom
//Qs.parse returns all the query parameters as object
const {name , _id } = Qs.parse(location.search, {ignoreQueryPrefix : true })
console.log(name)
console.log(location.search)


socket.emit("join", { name ,_id})

const setStatus = (s)=>{
     // Set status
     status.textContent = s;
     setStatus(status.textContent);
 
}

//Handle Output
 socket.on('output',(data)=>{
    //console.log(data)
    if(data.length){
        for(var x = 0;x < data.length;x++){
            // Build out message div
            var message = document.createElement('div')
            message.setAttribute('class', 'chat-message')
            message.textContent = data[x].name+": "+data[x].message
            messages.appendChild(message)
            messages.insertBefore(message, messages.firstChild)
        }
    }
})


socket.on('status',(data)=>{
    // get message status
    setStatus((typeof data === 'object')? data.message : data);
    // If status is clear, clear text
    if(data.clear){
        textarea.value = '';
    }
})


formSubmit.addEventListener('submit', (e)=>{
    e.preventDefault()
    socket.emit('input', {
        name:name,
        message:textarea.value
    })
    textarea.value = ""
})