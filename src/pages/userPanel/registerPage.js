const kb = require('./../../helpers/keyboard-buttons')
const keyboard = require('./../../helpers/keyboard')
const { updateUser} = require('./../../controllers/userController')

const urs1 = async (bot, chat_id, text) => {
  let mes_1, mes_2
  await updateUser({telegram_id: chat_id}, {lang: text, step: 1})

  if (text === kb.language.uz) {
    mes_1 = 'Keling tanishamiz'
    mes_2 = 'Ismingiz?'
  } else if (text === kb.language.ru) {
    mes_1 = 'Давайте познакомимся'
    mes_2 = 'Как вас зовут?'
  }

  await bot.sendMessage(chat_id, mes_1)
  await bot.sendMessage(chat_id, mes_2)
}

const urs2 = async (bot, chat_id, text, lang) => {
  let message, msg, kbb

  if (lang === kb.language.uz) {
    kbb = kb.options.send.uz
    message = 'Telefon raqamingizni ulashing'
    msg = `Contactingizni jo'natish uchun ${kbb} ni bosing`
  } else {
    kbb = kb.options.send.ru
    message = 'Поделитесь своим контактом'
    msg = `Нажмите ${kbb} тобы отправить ваш контакт`
  }

  await updateUser({telegram_id: chat_id}, {name: text, step: 2})

  await bot.sendMessage(chat_id, message)
  await bot.sendMessage(chat_id, msg, {
    parse_mode: "Markdown",
    reply_markup: {resize_keyboard: true, keyboard: [[{text: kbb, request_contact: true}]], one_time_keyboard: true}
  })
}

const urs3 = async (bot, chat_id, text, lang) => {
  let message, kbb

  if (lang === kb.language.uz) {
    message = 'Registratsiya muvaffaqqiyatli yakunlandi'
    kbb = keyboard.main.uz
  } else if (lang === kb.language.ru) {
    message = 'Регистрация успешно завершена'
    kbb = keyboard.main.ru
  }

  await updateUser({telegram_id: chat_id}, {step: 3, number: text, status: 'active'})

  await bot.sendMessage(chat_id, message, {reply_markup: {resize_keyboard: true, keyboard: kbb}})
}

const userRegister = async (bot, user, chat_id, text, lang) => {
  try {
    if (user.step === 0) await urs1(bot, chat_id, text)
    if (user.step === 1) await urs2(bot, chat_id, text, lang)
    if (user.step === 2) await urs3(bot, chat_id, text, lang)

  } catch (e) {
    console.log(e)
  }
}

module.exports = {userRegister}
