const socket = io()
const mensajeContainer = document.querySelector('.chat-container')
const mensajeForm = document.getElementById('send-container')
const mensajeInput = document.getElementById('message-input')
const perfilDestino = document.querySelector(".ws-nombre")

// Recibe un mensaje del servidor
socket.on('chat-message', data => {
    appendMessage(`${data.name}: ${data.message}`)
})

// Alguien se ha conectado
socket.on('user-connected', name => {
    appendMessage(`${name} se ha conectado`)
})

// Alguien se ha desconectado
socket.on('user-disconnected', name => {
    appendMessage(`${name} se ha desonectado`)
})

// Envío un mensaje al servidor
mensajeForm.addEventListener('submit', e => {
    e.preventDefault()
    const message = mensajeInput.value
    appendMessage(`${message}`, 'my')
    socket.emit('send-chat-message', message)
    mensajeInput.value = ''
})

// Escribo un mensaje en mi pantalla
function appendMessage(message, tipo = 'friend') {
    const messageElement = document.createElement('div')
    messageElement.className = `message-box ${tipo}-message`
    let now = new Date()
    messageElement.innerHTML = `<p>${message}<br><span>${now.getHours()}:${now.getMinutes()}</span></p>`
    mensajeContainer.append(messageElement)
    mensajeContainer.scrollTo(0, mensajeContainer.scrollHeight);
}


// No inicia hasta tener un nombre de usuario
let nombre = null;
do {
    nombre = prompt("Cuál es tu nombre?")
} while (nombre === null || nombre === "")
perfilDestino.innerText = nombre
// Le avisa a todos que has entrado
appendMessage('Te has unido', 'my')
socket.emit('new-user', nombre)