const express = require('express')
const app = express()
const cors = require('cors')
app.use(express.urlencoded({ extended: true }))
app.use(express.json())
app.use(cors())

const datos = require('./datos')
datos.recargarDatos()
// # Inicialización de rutas de los endpoints
const index = require('./routes/index')
const lizardon = require('./routes/lizardon')

// # Registro de rutas de los endpoints
app.use('/', index)
app.use('/lizardon', lizardon.router)

// # Inicialización de bots
const discord = require('./components/discord/discord')
discord.inicializar()

app.listen(34301, () => console.log('App funcionando en http://localhost:34301'))
