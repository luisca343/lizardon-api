const express = require('express')
const app = express()
app.use(express.urlencoded({ extended: true }))
app.use(express.json())

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

app.listen(3000, () => console.log('App funcionando en http://localhost:3000'))
