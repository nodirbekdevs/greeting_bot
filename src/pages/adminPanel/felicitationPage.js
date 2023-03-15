const kb = require('./../../helpers/keyboard-buttons')
const keyboard = require('./../../helpers/keyboard')
const {mkdir} = require('fs/promises')
const {existsSync} = require('fs')
const {rename, readFile} = require('fs/promises')
const {join} = require('node:path')
const {getFelicitations, getFelicitation, makeFelicitation, updateFelicitation, deleteFelicitation} = require('./../../controllers/felicitationController')
const {getAdmin, updateAdmin} = require('./../../controllers/adminController')
const {report, felicitation_pagination} = require('./../../helpers/utils')

let felicitation_id

const afls0 = async (bot, chat_id) => {
  await bot.sendMessage(chat_id, "Tabriklar sahifasi", {
    reply_markup: {resize_keyboard: true, keyboard: keyboard.admin.felicitations, one_time_keyboard: true}
  })
}

const afls1 = async (bot, chat_id) => {
  await updateAdmin({telegram_id: chat_id}, {step: 6})

  await bot.sendMessage(chat_id, "Kim uchun tabriklarni ko'rmoqchisiz", {
    reply_markup: {resize_keyboard: true, keyboard: keyboard.options.types_relations, one_time_keyboard: true}
  })
}

const afls2 = async (bot, chat_id, text) => {
  const query = {author: chat_id, type: text, status: 'active'}, report = await felicitation_pagination(1, 6, query)

  await updateAdmin({telegram_id: chat_id}, {situation: `FELICITATION_${text}`})

  await bot.sendMessage(chat_id, report.text, report.kbs)
}

const afls3 = async (bot, chat_id, message_id, data) => {
  let query, report

  const type = (await getAdmin({telegram_id: chat_id})).situation.split('_')

  if ((data[0] === 'left' || data[0] === 'right') && data[1] === 'felicitations') {
    query = {author: chat_id, type: type[1], status: 'active'}

    report = await felicitation_pagination(parseInt(data[2]), 6, query)
  }

  if (report) {
    const kbb = report.kbs

    await bot.editMessageText(report.text, {chat_id, message_id, parse_mode: 'HTML', reply_markup: kbb})
  }
}

const afls4 = async (bot, chat_id, message_id, _id) => {
  const felicitation = await getFelicitation({_id}), message = report(felicitation, 'FELICITATION', kb.language.uz)

  await bot.editMessageMedia({type: 'audio', media: felicitation.file, caption: message, parse_mode: 'HTML'}, {
    chat_id, message_id, reply_markup: {
      inline_keyboard: [[{text: kb.options.back.uz, callback_data: JSON.stringify({phrase: 'fl_back', id: ''})}]]
    }
  })
}

const afls5 = async (bot, chat_id, message_id) => {
  const type = (await getAdmin({telegram_id: chat_id})).situation.split('_'),
    query = {author: chat_id, type: type[1], status: 'active'}, report = await felicitation_pagination(1, 6, query)

  await bot.editMessageText(report.text, {
    chat_id, message_id, parse_mode: 'HTML', reply_markup: report.kbs.reply_markup
  })
}

const afls6 = async (bot, chat_id) => {
  const new_felicitation = await makeFelicitation({author: chat_id})
  felicitation_id = new_felicitation._id

  await bot.sendMessage(chat_id, "Tabrik kim haqida ekanini tanlang", {
    reply_markup: {resize_keyboard: true, keyboard: keyboard.options.types_relations, one_time_keyboard: true}
  })
}

const afls7 = async (bot, chat_id, _id, text) => {
  await updateFelicitation({_id}, {type: text, step: 1})

  const path = join(__dirname, `${kb.options.paths.felicitation}/${text}`)

  if (!existsSync(path)) await mkdir(join(__dirname, kb.options.paths.felicitation, `/${text}`))

  await bot.sendMessage(chat_id, "Tabrikning sarlavhasini jo'nating", {
    reply_markup: {resize_keyboard: true, keyboard: keyboard.options.back.uz, one_time_keyboard: true}
  })
}

const afls8 = async (bot, chat_id, _id, text) => {
  await updateFelicitation({_id}, {title: text, step: 2})

  await bot.sendMessage(chat_id, "Tabrikni jo'nating", {
    reply_markup: {resize_keyboard: true, keyboard: keyboard.options.back.uz, one_time_keyboard: true}
  })
}

const afls9 = async (bot, chat_id, _id, text) => {
  await updateFelicitation({_id}, {content: text, step: 3})

  await bot.sendMessage(chat_id, "Tabrikni mp3 faylini jo'nating", {
    reply_markup: {resize_keyboard: true, keyboard: keyboard.options.back.uz, one_time_keyboard: true}
  })
}

const afls10 = async (bot, chat_id, _id, text) => {
  await updateFelicitation({_id}, {telegram_link: text, step: 4})

  const felicitation = await getFelicitation({_id})

  let message = report(felicitation, 'FELICITATION', kb.language.uz)

  message += `\n\nTugaganini tasdiqlaysizmi ?`

  await bot.sendMessage(chat_id, message, {
    reply_markup: {resize_keyboard: true, keyboard: keyboard.options.confirmation.uz, one_time_keyboard: true}
  })
}

const afls11 = async (bot, chat_id, _id, text) => {
  let message

  const felicitation = await getFelicitation({_id})

  if (text === kb.options.confirmation.uz) {
    const new_path = join(__dirname, `${kb.options.paths.felicitation}/${felicitation.type}/${felicitation.title}.mp3`)

    const downloaded_path = await bot.downloadFile(felicitation.telegram_link, join(__dirname, `${kb.options.paths.felicitation}/${felicitation.type}/`))

    const old_path = join(downloaded_path)

    await rename(old_path, new_path)

    await updateFelicitation({_id}, {file: new_path, step: 5, status: 'active'})

    message = "Tabrik muvaffaqqiyatli qo'shildi mp3 varianti bilan"
  } else if (text === kb.options.not_to_confirmation.uz) {
    await deleteFelicitation({_id})

    message = "Tabrik muvaffaqqiyatli qo'shilmadi"
  }

  await bot.sendMessage(chat_id, message, {
    reply_markup: {resize_keyboard: true, keyboard: keyboard.admin.felicitations, one_time_keyboard: true}
  })
}

const afls12 = async (bot, chat_id, _id) => {
  await deleteFelicitation({_id})

  await bot.sendMessage(chat_id, "Tabrik muvaffaqqiyatli qo'shilmadi",
    {reply_markup: {resize_keyboard: true, keyboard: keyboard.admin.poems}}
  )
}

const adminFelicitations = async (bot, chat_id, text) => {
  const admin = await getAdmin({telegram_id: chat_id})

  const felicitation = await getFelicitation({_id: felicitation_id, author: chat_id, status: 'process'})
    ? await getFelicitation({_id: felicitation_id, author: chat_id, status: 'process'})
    : (await getFelicitations({author: chat_id, status: 'process'}))[0]

  if (text === kb.admin.pages.felicitations) await afls0(bot, chat_id)
  if (text === kb.admin.felicitations.all) await afls1(bot, chat_id)
  if (text === kb.admin.felicitations.add) await afls6(bot, chat_id)

  if (admin.step === 5) {
    if (text === kb.options.back.uz) {
      await updateAdmin({telegram_id: chat_id}, {situation: '', step: 0})
      await afls0(bot, chat_id)
    }
    if (text !== kb.options.back.uz) await afls2(bot, chat_id, text)
  }

  if (felicitation) {
    if (text === kb.options.back.uz || text === kb.options.back.ru) {
      await afls12(bot, chat_id, felicitation._id)
    } else if (text !== kb.options.back.uz || text !== kb.options.back.ru) {
      if (felicitation.step === 0) await afls7(bot, chat_id, felicitation._id, text)
      if (felicitation.step === 1) await afls8(bot, chat_id, felicitation._id, text)
      if (felicitation.step === 2) await afls9(bot, chat_id, felicitation._id, text)
      if (felicitation.step === 3) await afls10(bot, chat_id, felicitation._id, text)
      if (felicitation.step === 4) await afls11(bot, chat_id, felicitation._id, text)
    }
  }
}

module.exports = {adminFelicitations, afls0, afls3, afls4, afls5}
