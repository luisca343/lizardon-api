const { SlashCommandBuilder } = require('@discordjs/builders')

module.exports = {
  data: new SlashCommandBuilder()
    .setName('bidoof')
    .setDescription('Doof')
    .addStringOption(option => option.setRequired(true).setName('pregunta').setDescription('Pregúntale algo a Bidoof')),
  async execute (interaction) {
    let numI = Math.random() * 10 + 1
    let numO = Math.random() * 10 + 1
    let bidoof = 'B'
    while (numI >= 0) {
      bidoof += 'i'
      numI--
    }
    bidoof += 'd'
    while (numO >= 0) {
      bidoof += 'o'
      numO--
    }
    bidoof += 'f'
    interaction.reply(
      {
        content: bidoof
      }
    )
  }
}
