const TelegramBot = require('node-telegram-bot-api')
const config = require('./helpers/config')
const db = require('./helpers/db')
const {adminPanel, adminPanelQuery, getAdmin} = require('./pages/adminPanel/adminPanel')
const {makeAdmin} = require('./controllers/adminController')
// const {ownerPanel, ownerPanelQuery, getOwner} = require('./pages/ownerPanel/ownerPanel')
// const {managerPanel, managerPanelQuery, getManager} = require('./pages/managerPanel/managerPanel')
// const {employeePanel, employeePanelQuery, getEmployee} = require('./pages/employeePanel/employeePanel')
// const {schedule} = require('./pages/schedule')

const bot = new TelegramBot(config.TOKEN, {polling: true, db})

bot.setMyCommands(
  [
    {command: '/start', description: 'Start the bot'},
    {command: '/stop', description: 'Stop the bot'}
  ]
).then()

bot.on('message', async message => {

  // await makeAdmin({telegram_id: message.from.id, name: message.from.first_name, username: message.from.username, number: '+998977041815'})

  const query = {telegram_id: message.from.id, status: 'active'}, admin = await getAdmin(query)

  try {
    if (admin) await adminPanel(bot, message, admin)
  } catch (e) {
    console.log(e)
  }
})

bot.on('callback_query', async query => {
  const query_id = query.id, telegram_id = query.from.id, message_id = query.message.message_id,
    {phrase, id} = JSON.parse(query.data), request = {telegram_id, status: 'active'}


  const admin = await getAdmin(request)

  try {
    if (admin) await adminPanelQuery(bot, telegram_id, query_id, message_id, phrase, id)
  } catch (e) {
    console.log(e)
  }
})

// schedule(bot)
