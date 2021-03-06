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
      db.query('SELECT u.id, u.nombre, (SELECT COUNT(*) FROM frases WHERE idUsuario = u.id) as frases FROM usuarios u ORDER BY frases DESC, nombre ASC', function (err, result) {
        if (err) {
          return reject(err)
        }
        return resolve(result)
      })
    })
  }
}

router.get('/frases', function (req, res) {
  db.query('SELECT f.id, f.frase, f.fecha, u.nombre, u.imagen, u.transparente, u.id as idUsuario  FROM frases f JOIN usuarios u ON f.idUsuario = u.id ORDER BY fecha ASC', function (err, result, fields) {
    if (err) {
      console.log(err)
      return
    }
    res.json(result)
  })
})

router.get('/frases/:nombre', function (req, res) {
  const nombre = req.params.nombre.toLowerCase()
  db.query(`SELECT f.id, f.frase, f.fecha, u.nombre, u.imagen, u.transparente, u.id as idUsuario  FROM frases f JOIN usuarios u ON f.idUsuario = u.id WHERE LOWER(u.nombre) = '${nombre}' ORDER BY fecha ASC`, function (err, result, fields) {
    if (err) {
      console.log(err)
      return
    }
    res.json(result)
  })
})

router.get('/biki', function (req, res) {
  db.query('SELECT f.id, f.frase, f.fecha, u.nombre, u.imagen, u.transparente, u.id as idUsuario  FROM biki f JOIN usuarios u ON f.idUsuario = u.id ORDER BY fecha ASC', function (err, result, fields) {
    if (err) {
      console.log(err)
      return
    }
    res.json(result)
  })
})

router.get('/frases1', function (req, res) {
  db.query('SELECT f.id, f.frase, f.fecha, u.nombre, u.imagen, u.transparente, u.id as idUsuario  FROM frases1 f JOIN usuarios u ON f.idUsuario = u.id ORDER BY fecha ASC', function (err, result, fields) {
    if (err) {
      console.log(err)
      return
    }
    res.json(result)
  })
})

router.get('/about', function (req, res) {
  res.send('En efecto, lizardon')
})
