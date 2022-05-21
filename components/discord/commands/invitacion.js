const { SlashCommandBuilder } = require('@discordjs/builders')
const { MessageEmbed } = require('discord.js')
module.exports = {
  data: new SlashCommandBuilder()
    .setName('invitacion')
    .setDescription('Crea una votación de invitación')
    .addStringOption(option => option.setRequired(true).setName('nombre').setDescription('La persona a invitar'))
    .addStringOption(option => option.setRequired(false).setName('descripción').setDescription('Descripción de la persona'))
    .addStringOption(option => option.setRequired(false).setName('imagen').setDescription('Imagen descriptiva')),
  async execute (interaction) {
    const nombre = interaction.options.getString('nombre')
    const descripción = interaction.options.getString('descripción')
    const imagen = interaction.options.getString('imagen')
    const embed = new MessageEmbed()
      .setColor('#0099ff')
      .setTitle(`¿Invitamos a ${nombre}?`)
      .setDescription(descripción || '')
      .setImage(imagen)
      .setTimestamp()

    interaction.reply(
      {
        content: '¡Recomendación enviada!',
        ephemeral: true
      }
    )
    interaction.channel.send({ embeds: [embed] }).then(function (msg) {
      msg.react('✅')
      msg.react('❌')
      msg.react('🏳️')
      msg.pin()
    })
  }
}
