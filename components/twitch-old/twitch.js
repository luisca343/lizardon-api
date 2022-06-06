const Axios = require('axios')
require('dotenv').config()
const tmi = require('tmi.js')
const socket = require('../websocket/websocket')

const imagenesPerfil = new Map()

/* Export */
module.exports = {
  inicializar: async function () {
    console.log('Twitch iniciando... ' + process.env.TWITCH_TOKEN)
    const client = new tmi.Client({
    //  options: {
    //    debug: true
    //  },
      connection: {
        secure: true,
        reconnect: true
      },
      identity: {
        password: `oauth:${process.env.TWITCH_TOKEN}`
      },
      // the channel we're connecting to
      channels: ['Luisca343']
    })
    // the actual reporting event
    client.connect()
    client.on('message', (channel, tags, message, self) => {
      loggearMensaje(channel, tags, message, self)
      if (self || !message.startsWith('!')) return
      const args = message.slice(1).split(' ')
      const command = args.shift().toLowerCase()
      if (command === 'hola') {
        client.say(channel, `@${tags.username} pa ti mi cola`)
      }
    })
  }
}

function loggearMensaje (channel, tags, message, self) {
  const userId = tags['user-id']
  if (!imagenesPerfil.get(userId)) {
    Axios.get(`https://api.twitch.tv/helix/users?id=${userId}`,
      {
        headers: {
          Authorization: 'Bearer 1r0tk4bmrhp98a1hqt45faqaed1wq5',
          'Client-Id': 'bnbv6jrp64jjqehsemx9jysh9vttqh'
        }
      })
      .then(function (res) {
        const datos = res.data.data[0]
        imagenesPerfil.set(userId, datos.profile_image_url)
        procesarMensaje(channel, tags, message, self, imagenesPerfil.get(userId))
        console.log('Imagen obtenida de Twitch')
      })
      .catch(function (error) {
        console.log(error)
      })
  } else {
    console.log('Imagen obtenida de memoria')
    procesarMensaje(channel, tags, message, self, imagenesPerfil.get(userId))
  }
}

function procesarMensaje (channel, tags, message, self, img) {
  if (message.charAt(0) === '!') {
    procesarComando(channel, tags, message, self, img)
    return
  }
  enviarMensaje(tags, message, img)
}

function enviarMensaje (tags, message, img) {
  const nombre = tags['display-name']
  const userId = tags['user-id']
  const params = { id: userId, nombre, mensaje: message, imagen: img }
  socket.emitMsg(JSON.stringify(params))
}

async function procesarComando (channel, tags, message, self, img) {
  const userId = tags['user-id']
  const comando = message.split('!')[1].split(' ')[0]
  const paramsArr = message.split('!')[1].split(' ')
  const nombre = tags['display-name']
  paramsArr.shift()
  const params = paramsArr.join(' ')
  if (comando === 's') {
    // socket.tts(`${nombre}: ` + params)
    enviarMensaje(tags, params, img)
  } else if (comando === 'promo') {
    let nombreUsuario = paramsArr[0]
    if (nombreUsuario.charAt(0) === '@') {
      nombreUsuario = nombreUsuario.slice(1)
    }
    const test = await Axios.get(`https://api.twitch.tv/helix/users?login=${nombreUsuario}`,
      {
        headers: {
          Authorization: 'Bearer 1r0tk4bmrhp98a1hqt45faqaed1wq5',
          'Client-Id': 'bnbv6jrp64jjqehsemx9jysh9vttqh'
        }
      })
    const datos = test.data.data
    socket.alerta('promo', datos)
    /*
    Axios.get(`https://api.twitch.tv/helix/clips?broadcaster_id=${userId}`,
      {
        headers: {
          Authorization: 'Bearer 1r0tk4bmrhp98a1hqt45faqaed1wq5',
          'Client-Id': 'bnbv6jrp64jjqehsemx9jysh9vttqh'
        }
      })
      .then(function (res) {
        const datos = res.data.data
        console.log(datos)
      })
      .catch(function (error) {
        console.log(error)
      }) */
  }
}
