const socket = io();

const clientsTotal = document.getElementById('clients-total');

const messageContainer = document.getElementById('message-container');
const nameInput = document.getElementById('name-input');
const messageForm= document.getElementById('message-form');
const messageInput = document.getElementById('message-input');
const tone = new Audio('./MessageTone.mp3');


socket.on('clients-total', (data)=>{
    clientsTotal.innerText = 'Total clients: '+data;
    console.log(data);
})

messageForm.addEventListener('submit', (e)=>{
    e.preventDefault();
    sendMessaage();
});

function sendMessaage(){
    console.log(messageInput.value);
    if(messageInput.value === '')return;
    const data = {
        name: nameInput.value,
        message: messageInput.value,
        hours: new Date().getHours(),
        minutes: new Date().getMinutes()
    }
    socket.emit('message', data);
    addMessage(true, data);
    messageInput.value = '';
}

socket.on('chat-message', (data)=>{
    console.log(data);
    addMessage(false,data);
})
socket.on('typing', (name) => {
    clearFeedback();
    if(name === '')return;
    const ele = `<li class="message-feedback" id="message-feedback">
                <p class="feedback" id="feedback">
                    <i class="fa-solid fa-comment"></i> ${name} is typing message....
                </p>
            </li>`
    messageContainer.innerHTML += ele;
})


function addMessage(isOwnMessage, data) {
    clearFeedback();
    const element = `<li class="${isOwnMessage?"message-right":"message-left"}">
                <p class="message">
                    ${data.message}
                    <span>${data.name} <i class="fas fa-clock"></i> ${data.hours>12?data.hours-12:data.hours}:${data.minutes}</span>
                </p>
            </li>`
            messageContainer.innerHTML += element;
            tone.play();
    messageContainer.scrollTo(0, messageContainer.scrollHeight);
    //messageContainer.remove(ele);
}

messageInput.addEventListener('focus', ()=>{
    socket.emit('typing', nameInput.value);
});

messageInput.addEventListener('blur', ()=>{
    socket.emit('typing','');
});

messageInput.addEventListener('keypress', ()=> {
    socket.emit('typing', nameInput.value);
})

function clearFeedback() {
    document.querySelectorAll('#message-feedback').forEach(element => {
        element.parentNode.removeChild(element);
    })
}




