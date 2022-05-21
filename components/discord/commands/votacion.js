const { SlashCommandBuilder } = require('@discordjs/builders')
const { MessageEmbed } = require('discord.js')
module.exports = {
  data: new SlashCommandBuilder()
    .setName('votacion')
    .setDescription('Crea una votación')
    .addStringOption(option => option.setRequired(true).setName('titulo').setDescription('Título de la votación'))
    .addStringOption(option => option.setRequired(false).setName('descripción').setDescription('Descripción de la votacion'))
    .addStringOption(option => option.setRequired(false).setName('imagen').setDescription('Imagen descriptiva')),
  async execute (interaction) {
    const titulo = interaction.options.getString('titulo')
    const descripción = interaction.options.getString('descripción')
    const imagen = interaction.options.getString('imagen')
    const embed = new MessageEmbed()
      .setColor('#0099ff')
      .setTitle(titulo)
      .setDescription(descripción || '')
      .setImage(imagen)
      .setTimestamp()

    interaction.channel.send({ embeds: [embed] }).then(function (msg) {
      msg.react('✅')
      msg.react('❌')
      msg.react('🏳️')
    })
  }
}
