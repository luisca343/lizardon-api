let io = null
const sockets = []
module.exports = {
  iniciar: function (server) {
    io = require('socket.io')(server, {
      cors: {
        origin: '*',
        methods: ['GET', 'POST']
      }
    })

    io.on('connection', (socket) => {
      sockets[socket.id] = socket
      socket.on('join', function (room) {
        socket.join(room)
        console.log('SALAS')
        // console.log(io.sockets.adapter.rooms)
        console.log(`Unido a ${room}`)
      })
      const request = {
        img: 'https://static.wikia.nocookie.net/espokemon/images/9/95/Charizard.png/revision/latest?cb=20180325003352',
        sonido: '',
        texto: 'Por fin he conseguido que esta mierda funcione, cómeme los huevos Tai'
      }
      // socket.broadcast.emit('tts', 'Por fin he conseguido que esta mierda funcione, cómeme los huevos Tai')
      socket.on('mensajeTwitch', (arg) => {
        console.log('PATATA')
      })
      socket.on('mensajeTwitch', (arg) => {
        console.log(request)
      })
      socket.on('disconnect', function () {
        console.log('Socket eliminado')
        delete sockets[socket.id]
      })
    })
  },
  getInstance: function () {
    if (io !== null) {
      return io
    }
    console.log('Todavía no ha cargado')
  },
  emitMsg: function (params) {
    io.to('Luisca343').emit('mensajeTwitch', `${params}`)
  },
  tts: function (params) {
    io.to('Luisca343-overlay').emit('tts', `${params}`)
  },
  alerta: function (tipo, datos) {
    const json = { tipo, datos }
    // console.log(json)
    io.to('Luisca343-overlay').emit('alerta', `${JSON.stringify(json)}`)
  }
}
