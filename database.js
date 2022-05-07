const dotenv = require('dotenv')
dotenv.config()
const mysql = require('mysql')
const config = {
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE
}
let connection = mysql.createConnection(config)

connection.connect(error => {
  if (error) console.log(error)
  console.log('Base de Datos conectada!')
})

connection.on('error', function (error) {
  console.log('Error con la Base de Datos', error)
  if (error.code === 'PROTOCOL_CONNECTION_LOST') {
    connection = mysql.createConnection(config)
  }
})

module.exports = connection
