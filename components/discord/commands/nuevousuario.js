const { SlashCommandBuilder } = require('@discordjs/builders')
const lizardon = require('../../../routes/lizardon')
const datos = require('../../../datos')

module.exports = {
  data: new SlashCommandBuilder()
    .setName('nuevousuario')
    .setDescription('Añade un nuevo usuario a la lista')
    .addStringOption(option => option.setRequired(true).setName('usuario').setDescription('El nombre del usuario')),
  async execute (interaction) {
    const usuario = interaction.options.getString('usuario')
    try {
      await lizardon.nuevoUsuario(usuario)
      interaction.reply(
        {
          content: `Se ha añadido el nuevo usuario '${usuario}'`
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
