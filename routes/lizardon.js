const express = require('express')
const router = express.Router()
const db = require('../database')

module.exports = {
  router,
  nuevoUsuario: async function (nombre) {
    return await new Promise((resolve, reject) => {
      db.query('INSERT INTO usuarios (nombre) VALUES (?)', [nombre], function (err, result) {
        if (err) {
          return reject(err)
        }
        return resolve(result)
      })
    })
  },
  nuevaFrase: async function (idUsuario, frase) {
    return await new Promise((resolve, reject) => {
      db.query(`INSERT INTO frases (idUsuario, frase) VALUES (${idUsuario}, '${frase}')`, function (err, result) {
        if (err) {
          console.log(err)
          return reject(err)
        }
        return resolve(result)
      })
    })
  },
  getUsuarios: async function () {
    return await new Promise((resolve, reject) => {
      db.query('SELECT * FROM usuarios ORDER BY nombre ASC', function (err, result) {
        if (err) {
          return reject(err)
        }
        return resolve(result)
      })
    })
  }
}

router.get('/', function (req, res) {
  res.send('Lizardon')
  db.query('SELECT * FROM frases', function (err, result) {
    if (err) {
      console.log(err.message)
      return null
    }
    console.log(result)
  })
})

router.get('/about', function (req, res) {
  res.send('En efecto, lizardon')
})