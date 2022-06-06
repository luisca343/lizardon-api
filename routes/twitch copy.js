const { default: axios } = require('axios')
const express = require('express')
const router = express.Router()
const db = require('../database')
const crypto = require('crypto')
require('dotenv').config()

module.exports = {
  router
}

router.get('/auth', async function (req, res) {
  console.log('========== AUTENTICANDO ==========')
  const code = req.query.code
  const scope = req.query.scope
  const tokenRes = await axios.post(`https://id.twitch.tv/oauth2/token?client_id=${process.env.TWITCH_CLIENT_ID}&client_secret=${process.env.TWITCH_SECRET}&code=${code}&grant_type=authorization_code&redirect_uri=https://local.lizardon.es/twitch/auth`)
    .catch((error) => {
      console.log(`No se ha podido obtener el token OAuth: ${error}`)
      res.send(error)
      return 400
    })
  const token = tokenRes.data
  console.log('== HOLA ==')
  console.log(token)
  /*
  if (tokenRes === 400) return
  const usrRes = await getTwitchUser(token.access_token)
  const userData = usrRes.data.data[0]
  const hash = crypto.createHash('sha256').update(token.refresh_token).digest('hex')

  const usuario = await new Promise((resolve, reject) => {
    db.query(`SELECT * FROM twitch__usuarios WHERE id_twitch = '${userData.id}'`, function (err, result) {
      if (err) {
        console.log(err)
        return reject(err)
      }
      return resolve(result)
    })
  })

  console.log(`Hay un total de ${usuario.length}`)
  if (usuario.length === 0) {
    const resultado = await new Promise((resolve, reject) => {
      db.query(`INSERT IGNORE INTO twitch__usuarios (id_twitch, nombre, refresh_token, token_hash) VALUES ('${userData.id}', '${userData.display_name}', '${token.refresh_token}', '${hash}')`, function (err, result) {
        if (err) {
          console.log(err)
          return reject(err)
        }
        return resolve(result)
      })
    })
    console.log(resultado)
  } else {
    const resultado = await new Promise((resolve, reject) => {
      db.query(`UPDATE twitch__usuarios SET token_hash = '${hash}' WHERE id_twitch = '${userData.id}'`, function (err, result) {
        if (err) {
          console.log(err)
          return reject(err)
        }
        return resolve(result)
      })
    })
    console.log(resultado)
  }

  db.query(`INSERT IGNORE INTO twitch__usuarios (id_twitch, nombre, refresh_token, token_hash) VALUES ('${userData.id}', '${userData.display_name}', '${token.refresh_token}', '${hash}')`, function (err, result) {
    if (err) {
      console.log(err)
    }
    res.send({ hash })
  })
  */
})

router.post('/getUsuario', async function (req, res) {
  console.log('getUsuario')
  const result = await new Promise((resolve, reject) => {
    db.query(`SELECT * FROM twitch__usuarios WHERE token_hash = '${req.body.hash}'`, function (err, result) {
      if (err) {
        console.log(err)
        return reject(err)
      }
      return resolve(result)
    })
  })
  if (result.length === 1) {
    const usuario = result[0]
    console.log('=== USUARIO ===')
    console.log(usuario)
    console.log('=== TWITCHUSER ===')
    const usrRes = await getTwitchUser(usuario)
    console.log(usrRes)
  }
  // const usrRes = await getTwitchUser(token)
})

async function getTwitchUser (usuario) {
  console.log('=== getTwitchUser ===')
  const token = usuario.access_token
  console.log(token)
  const headers = {
    Authorization: `Bearer ${token}`,
    'Client-Id': process.env.TWITCH_CLIENT_ID
  }
  const usrRes = await axios.get('https://api.twitch.tv/helix/users', { headers })
    .catch((error) => {
      if (error.response.status === 401) {
        console.log(`No se ha podido obtener la información del usuario: ${error}`)
      }
    })
  refrescarUsuario(usuario.refresh_token)
  return usrRes
}

async function refrescarUsuario (token) {
  console.log('refrescarUsuario')
  /*
  const usrRes = await axios.get('https://api.twitch.tv/helix/users', { headers })
    .catch((error) => {
      if (error.response.status === 401) {
        console.log(`No se ha podido obtener la información del usuario: ${error}`)
      }
    }) */
}

// https://id.twitch.tv/oauth2/authorize?response_type=code&client_id=ffufl0nly7omwkf2brv1dnkuo89ati&redirect_uri=https://api.lizardon.es/twitch/auth&scope=channel%3Amanage%3Apolls+channel%3Aread%3Apolls
// https://id.twitch.tv/oauth2/authorize?response_type=code&client_id=om90s2of19rz5srmug5x7l0wmlpqqe&redirect_uri=https://local.lizardon.es/twitch/auth&scope=channel%3Amanage%3Apolls+channel%3Aread%3Apolls
