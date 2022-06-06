require('dotenv').config()
const Axios = require('axios')
/* Export */
module.exports = {
  inicializar: async function () {
    // const res = await twitchRequest(`https://api.twitch.tv/helix/users?id=39110859`)
    // console.log(res)
  }
}
// https://localhost:3000/trapinshka
async function twitchRequest (request) {
  const res = await Axios.get(request,
    {
      headers: {
        Authorization: 'Bearer 1r0tk4bmrhp98a1hqt45faqaed1wq5',
        'Client-Id': 'bnbv6jrp64jjqehsemx9jysh9vttqh'
      }
    })
  return res.data.data
}
