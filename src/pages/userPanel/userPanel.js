const kb = require('./../../helpers/keyboard-buttons')
const keyboard = require('./../../helpers/keyboard')
const {mainPage} = require('./mainPage')
const {userRegister} = require('./registerPage')
const {userSettings} = require('./settingsPage')
const {userFeedback} = require('./feedbackPage')
const {userAudios} = require('./audioPage')
const {userPanelQuery} = require('./userPanelQuery')
const {getUser, updateUser, makeUser} = require('./../../controllers/userController')

let lang

const userPanel = async (bot, message) => {
  let text, username = "", password = ""
  const telegram_id = message.from.id, first_name = message.from.first_name

  try {
    if (message) {
      if (message.contact) {
        text = message.contact.phone_number
      }
      if (message.location) {
        text = message.location
      }
      if (message.text) {
        text = message.text
      }
      if (message.from.username !== "") {
        username = message.from.username
      }
    }

    const user = await getUser({telegram_id})

    if (user.step === 0 || user.step === 5) {
      if (text === kb.language.uz || text === kb.language.ru) await updateUser({telegram_id}, {lang: text})
    }

    if (!user && text === kb.start) {
      let message = ''

      await makeUser({telegram_id, username})

      message += `Bo'timizga xush kelibsiz ${first_name}. <b>Tilni tanlang</b> ${kb.language.uz} \n`
      message += `Добро пожаловать ${first_name}. <b>Выберите язык</b> ${kb.language.ru}`

      await bot.sendMessage(telegram_id, message, {
        parse_mode: 'HTML', reply_markup: {resize_keyboard: true, keyboard: keyboard.language, one_time_keyboard: true}
      })
    }

    if (user) {
      lang = user.lang

      if (user.step < 3) await userRegister(bot, user, telegram_id, text, lang)

      if (user.status === 'active' && user.step >= 3) {
        if (username) if (user.username !== username) await updateUser({telegram_id}, {username})

        if (text === kb.main.uz || text === kb.main.ru || text === kb.start) await mainPage(bot, telegram_id, lang)

        await userSettings(bot, user, text, lang)
        await userFeedback(bot, telegram_id, text, lang)
        await userAudios(bot, telegram_id, text, lang)
      }
    }
  } catch (e) {
    console.log(e)
  }
}

module.exports = {userPanel, userPanelQuery, getUser}
