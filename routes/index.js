const express = require('express')
const router = express.Router()
const db = require('../database')

router.get('/', function (req, res) {
  res.send('Esto funciona')
  db.query('SELECT * FROM frases', function (err, result) {
    if (err) console.log(err.message)
    // console.log(result)
  })
})

router.get('/about', function (req, res) {
  res.send('En efecto, funciona')
})

module.exports = router
