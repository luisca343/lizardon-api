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
  const tokenRes = await axios.post(`https://id.twitch.tv/oauth2/token?client_id=${process.env.TWITCH_CLIENT_ID}&client_secret=${process.env.TWITCH_SECRET}&code=${code}&grant_type=authorization_code&redirect_uri=${process.env.REDIRECT_URL}`)
    .catch((error) => {
      console.log(`No se ha podido obtener el token OAuth: ${error}`)
      res.send(error)
      return 400
    })
  const token = tokenRes.data
  if (tokenRes === 400) return
  const usrRes = await getTwitchUser(token)
  const userData = usrRes.data.data[0]
  console.log(userData)
  const hash = crypto.createHash('sha256').update(token.refresh_token).digest('hex')
  console.log(hash)

  const usuario = await new Promise((resolve, reject) => {
    db.query(`SELECT * FROM twitch__usuarios WHERE id_twitch = '${userData.id}'`, function (err, result) {
      if (err) {
        console.log(err)
        return reject(err)
      }
      return resolve(result)
    })
  })

  if (usuario.length === 0) {
    await new Promise((resolve, reject) => {
      console.log('Insertando datos')
      db.query(`INSERT IGNORE INTO twitch__usuarios (id_twitch, nombre, refresh_token, token_hash) VALUES ('${userData.id}', '${userData.display_name}', '${token.refresh_token}', '${hash}')`, function (err, result) {
        if (err) {
          console.log(err)
          return reject(err)
        }
        return resolve(result)
      })
    })
  } else {
    await new Promise((resolve, reject) => {
      console.log('Actualizando datos')
      db.query(`UPDATE twitch__usuarios SET token_hash = '${hash}', refresh_token = '${token.refresh_token}' WHERE id_twitch = '${userData.id}'`, function (err, result) {
        if (err) {
          console.log(err)
          return reject(err)
        }
        return resolve(result)
      })
    })
  }

  res.send({ hash })
})

router.post('/getUsuario', async function (req, res) {
  console.log('== GET ==')
  console.log(req.body.hash)
  console.log(`SELECT * FROM twitch__usuarios WHERE token_hash = '${req.body.hash}'`)
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
    console.log(usuario)
    const usrRes = await getTwitchUser(usuario)
    res.send(usrRes.data.data[0])
  } else {
    // res.send(434)
    console.log('Se redigirá al usuario a la autenticación')
  }
  // const usrRes = await getTwitchUser(token)
})

async function getTwitchUser (usuario) {
  console.log('Buscando usuario...')
  const token = usuario.access_token
  let usrRes = await fetchUser(token)
  if (!usrRes) {
    usrRes = await refrescarUsuario(usuario.refresh_token)
  }
  return usrRes
}

async function fetchUser (token) {
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
  return usrRes
}

async function refrescarUsuario (token) {
  const data = {
    client_id: process.env.TWITCH_CLIENT_ID,
    client_secret: process.env.TWITCH_SECRET,
    grant_type: 'refresh_token',
    refresh_token: token
  }
  // console.log(data)
  const nuevoToken = await axios.post('https://id.twitch.tv/oauth2/token', data)
    .catch((error) => {
      console.log(error)
    })
  const usrRes = await fetchUser(nuevoToken.data.access_token)
  console.log('========= Aquí estamos =========')
  console.log(usrRes)
  return usrRes
}

// https://id.twitch.tv/oauth2/authorize?response_type=code&client_id=ffufl0nly7omwkf2brv1dnkuo89ati&redirect_uri=https://lizardon.es/twitch/auth&scope=channel%3Amanage%3Apolls+channel%3Aread%3Apolls
// https://id.twitch.tv/oauth2/authorize?response_type=code&client_id=om90s2of19rz5srmug5x7l0wmlpqqe&redirect_uri=https://local.lizardon.es/twitch/auth&scope=channel%3Amanage%3Apolls+channel%3Aread%3Apolls
