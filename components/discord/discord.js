const { Client, Intents, Collection } = require('discord.js')
const dotenv = require('dotenv')
const fs = require('node:fs')
dotenv.config()

const { REST } = require('@discordjs/rest')
const { Routes } = require('discord-api-types/v9')
const commands = []
const commandFiles = fs.readdirSync('./components/discord/commands').filter(file => file.endsWith('.js'))

let _client
let _clientId

module.exports = {
  inicializar: async function () {
    const client = new Client({ intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES] })
    const clientId = process.env.DISCORD_ID

    client.once('ready', client => {
      _client = client
      _clientId = clientId
      recargarComandos(_client, _clientId)
    })

    client.on('messageCreate', msg => {
      if (msg.author.bot) return
      console.log(msg.content)
      msg.channel.send(`Has dicho '${msg.content}'`)
    })
    client.on('error', error => {
      console.error(error)
    })

    client.on('interactionCreate', async interaction => {
      if (!interaction.isCommand()) return
      const command = client.commands.get(interaction.commandName)
      if (!command) return
      try {
        await command.execute(interaction)
      } catch (error) {
        console.log(error)
        await interaction.reply({
          content: 'Ha petao, lol',
          ephemeral: true
        })
      }
    })
    client.login(process.env.DISCORD_KEY)
  },
  recargarComandos: () => recargarComandos()
}

function recargarComandos () {
  if (!_client) {
    console.log('No ha cargado')
    return
  }
  _client.commands = new Collection()

  for (const file of commandFiles) {
    const command = require(`./commands/${file}`)
    // console.log(`Registrando el comando ${command.data.name}`)
    commands.push(command.data.toJSON())
    _client.commands.set(command.data.name, command)
  }
  const rest = new REST({ version: '9' }).setToken(process.env.DISCORD_KEY);

  (async () => {
    try {
      console.log('Recargando los comandos (/)')
      await rest.put(
        Routes.applicationCommands(_clientId),
        { body: commands }
      )

      console.log('Se han recargado los comandos (/)')
    } catch (error) {
      console.error(error)
    }
  })()
}
