const { SlashCommandBuilder } = require('@discordjs/builders')
const lizardon = require('../../../routes/lizardon')
const datos = require('../../../datos')
module.exports = {
  data: new SlashCommandBuilder()
    .setName('nuevafrase')
    .setDescription('Guarda una frase para la posteridad')
    .addStringOption(option =>
      setOption(option)
    )
    .addStringOption(option => option.setRequired(true).setName('frase').setDescription('La maravillosa frase mencionada.')),
  async execute (interaction) {
    const usuario = interaction.options.getString('usuario')
    const frase = interaction.options.getString('frase')

    try {
      await lizardon.nuevaFrase(usuario, frase)
      interaction.reply(
        {
          content: `Se ha añadido la nueva frase "${frase}"`
        }
      )
      datos.recargarDatos()
    } catch (error) {
      interaction.reply(
        {
          content: `Ha ocurrido un error en la inserción: ${error.message}`,
          ephemeral: true
        }
      )
    }
  }
}

function setOption (option) {
  option.setName('usuario')
    .setDescription('La desafortunada persona que ha dicho algo normaln\'t')
    .setRequired(true)
  const usuarios = datos.usuarios
  usuarios.forEach(usuario => {
    option.addChoice(usuario.nombre, usuario.id.toString())
  })
  return option
}
