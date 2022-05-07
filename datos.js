const lizardon = require('./routes/lizardon')
const discord = require('./components/discord/discord')
module.exports = {
  usuarios: [],
  recargarDatos: () => recargarDatos()
}

async function cargarUsuarios () {
  const users = await lizardon.getUsuarios()
  users.forEach(user => {
    module.exports.usuarios.push(user)
  })
}

async function recargarDatos () {
  cargarUsuarios()

  discord.recargarComandos()
  console.log('Se han recargado los datos.')
}
