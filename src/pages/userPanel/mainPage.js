const kb = require('../../helpers/keyboard-buttons')
const keyboard = require('../../helpers/keyboard')

const ump = async (bot, chat_id, lang) => {
  let message, kbb

  if (lang === kb.language.uz) {
    message = 'Bosh sahifa'
    kbb = keyboard.user.pages.uz
  } else if (lang === kb.language.ru) {
    message = 'Домашняя страница'
    kbb = keyboard.user.pages.ru
  }

  await bot.sendMessage(chat_id, message, {reply_markup: {resize_keyboard: true, keyboard: kbb}})
}

const userMainPage = async (bot, chat_id, text) => {
  if (text === kb.start || (text === kb.main.uz || text === kb.main.ru)) await ump(bot, chat_id, lang)
}

module.exports = {userMainPage, ump}
