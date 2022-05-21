const express = require('express')
const app = express()
const cors = require('cors')
app.use(express.urlencoded({ extended: true }))
app.use(express.json())
app.use(cors())
app.options('*', cors())

const datos = require('./datos')
datos.recargarDatos()
// # Inicialización de rutas de los endpoints
const index = require('./routes/index')
const lizardon = require('./routes/lizardon')
// # Registro de rutas de los endpoints
app.use('/', index)
app.use('/lizardon', lizardon.router)

// # Inicialicamos el socket
const http = require('http')
const server = http.createServer()
const socket = require('./components/websocket/websocket')
socket.iniciar(server)

// # Inicialización de bots
const discord = require('./components/discord/discord')
discord.inicializar()

const twitch = require('./components/twitch/twitch')
twitch.inicializar(socket)

app.listen(34301, () => console.log('App funcionando en http://localhost:34301'))
server.listen(34304, () => console.log('Listening on port 34304'))
