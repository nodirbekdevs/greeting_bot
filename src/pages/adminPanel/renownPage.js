const kb = require('./../../helpers/keyboard-buttons')
const keyboard = require('./../../helpers/keyboard')
const {mkdir} = require('fs/promises')
const {existsSync} = require('fs')
const {rename, readFile} = require('fs/promises')
const {join} = require('node:path')
const {getRenowns, getRenown, makeRenown, updateRenown, deleteRenown} = require('./../../controllers/renownController')
const {getAdmin, updateAdmin} = require('./../../controllers/adminController')
const {report, renown_pagination} = require('./../../helpers/utils')

let renown_id

const ars0 = async (bot, chat_id) => {
  await bot.sendMessage(chat_id, "Ismlar sahifasi", {
    reply_markup: {resize_keyboard: true, keyboard: keyboard.admin.renown, one_time_keyboard: true}
  })
}

const ars1 = async (bot, chat_id) => {
  await updateAdmin({telegram_id: chat_id}, {step: 4})

  await bot.sendMessage(chat_id, "Kim uchun sherlarni ko'rmoqchisiz", {
    reply_markup: {resize_keyboard: true, keyboard: keyboard.options.types_gender, one_time_keyboard: true}
  })
}

const ars2 = async (bot, chat_id, text) => {
  const query = {author: chat_id, type: text, status: 'active'}, report = await renown_pagination(1, 6, query)

  await updateAdmin({telegram_id: chat_id}, {situation: `RENOWN_${text}`})

  await bot.sendMessage(chat_id, report.text, report.kbs)
}

const ars3 = async (bot, chat_id, message_id, data) => {
  let query, report

  const type = (await getAdmin({telegram_id: chat_id})).situation.split('_')

  if ((data[0] === 'left' || data[0] === 'right') && data[1] === 'renowns') {
    query = {author: chat_id, type: type[1], status: 'active'}

    report = await renown_pagination(parseInt(data[2]), 6, query)
  }

  if (report) {
    const kbb = report.kbs

    await bot.editMessageText(report.text, {chat_id, message_id, parse_mode: 'HTML', reply_markup: kbb})
  }
}

const ars4 = async (bot, chat_id, message_id, _id) => {
  const renown = await getRenown({_id}), message = report(renown, 'RENOWN', kb.language.uz)

  await bot.editMessageMedia({type: 'audio', media: renown.file, caption: message, parse_mode: 'HTML'}, {
    chat_id, message_id,  reply_markup: {
      inline_keyboard: [[{text: kb.options.back.uz, callback_data: JSON.stringify({phrase: 're_back', id: ''})}]]
    }
  })
}

const ars5 = async (bot, chat_id, message_id) => {
  const type = (await getAdmin({telegram_id: chat_id})).situation.split('_'),
    query = {author: chat_id, type: type[1], status: 'active'}, report = await renown_pagination(1, 6, query)

  await bot.editMessageText(report.text, {
    chat_id, message_id, parse_mode: 'HTML', reply_markup: report.kbs.reply_markup
  })
}

const ars6 = async (bot, chat_id) => {
  const new_renown = await makeRenown({author: chat_id})
  renown_id = new_renown._id

  await bot.sendMessage(chat_id, "Ismni tipini kiriting", {
    reply_markup: {resize_keyboard: true, keyboard: keyboard.options.types_gender, one_time_keyboard: true}
  })
}

const ars7 = async (bot, chat_id, _id, text) => {
  await updateRenown({_id}, {type: text, step: 1})

  const path = join(__dirname, `${kb.options.paths.renown}/${text}`)

  if (!existsSync(path)) await mkdir(join(__dirname, kb.options.paths.renown, `/${text}`))

  await bot.sendMessage(chat_id, "Ismni kiriting", {
    reply_markup: {resize_keyboard: true, keyboard: keyboard.options.back.uz, one_time_keyboard: true}
  })
}

const ars8 = async (bot, chat_id, _id, text) => {
  await updateRenown({_id}, {name: text, step: 2})

  await bot.sendMessage(chat_id, "Ismni mp3 faylini jo'nating", {
    reply_markup: {resize_keyboard: true, keyboard: keyboard.options.back.uz, one_time_keyboard: true}
  })
}

const ars9 = async (bot, chat_id, _id, text) => {
  await updateRenown({_id}, {telegram_link: text, step: 3})

  const renown = await getRenown({_id})

  let message = `<b>${renown.name}</b>\n`

  message += `\n\nTugaganini tasdiqlaysizmi ?`

  await bot.sendMessage(chat_id, message, { parse_mode: 'HTML',
    reply_markup: {resize_keyboard: true, keyboard: keyboard.options.confirmation.uz, one_time_keyboard: true}
  })
}

const ars10 = async (bot, chat_id, _id, text) => {
  let message

  const renown = await getRenown({_id})

  if (text === kb.options.confirmation.uz) {
    const new_path = join(__dirname, `${kb.options.paths.renown}/${renown.type}/${renown.name}.mp3`)

    const downloaded_path = await bot.downloadFile(renown.telegram_link, join(__dirname, `${kb.options.paths.renown}/${renown.type}/`))

    const old_path = join(downloaded_path)

    await rename(old_path, new_path)

    await updateRenown({_id}, {file: new_path, step: 4, status: 'active'})

    message = "Ism muvaffaqqiyatli qo'shildi mp3 varianti bilan"
  } else if (text === kb.options.not_to_confirmation.uz) {
    await deleteRenown({_id})

    message = "Ism muvaffaqqiyatli qo'shilmadi"
  }

  await bot.sendMessage(chat_id, message, {
    reply_markup: {resize_keyboard: true, keyboard: keyboard.admin.renown, one_time_keyboard: true}
  })
}

const ars11 = async (bot, chat_id, _id) => {
  await deleteRenown({_id})

  await bot.sendMessage(chat_id, "Ism muvaffaqqiyatli qo'shilmadi",
    {reply_markup: {resize_keyboard: true, keyboard: keyboard.admin.poems}}
  )
}

const adminRenowns = async (bot, chat_id, text) => {
  const admin = await getAdmin({telegram_id: chat_id})

  const renown = await getRenown({_id: renown_id, author: chat_id, status: 'process'})
    ? await getRenown({_id: renown_id, author: chat_id, status: 'process'})
    : (await getRenowns({author: chat_id, status: 'process'}))[0]

  if (text === kb.admin.pages.renowns) await ars0(bot, chat_id)
  if (text === kb.admin.renowns.all) await ars1(bot, chat_id)
  if (text === kb.admin.renowns.add) await ars6(bot, chat_id)

  if (admin.step === 4) {
    if (text === kb.options.back.uz) {
      await updateAdmin({telegram_id: chat_id}, {situation: '', step: 0})
      await ars0(bot, chat_id)
    }
    if (text !== kb.options.back.uz) await ars2(bot, chat_id, text)
  }

  if (renown) {
    if (text === kb.options.back.uz || text === kb.options.back.ru) {
      await ars11(bot, chat_id, renown._id)
    } else if (text !== kb.options.back.uz || text !== kb.options.back.ru) {
      if (renown.step === 0) await ars7(bot, chat_id, renown._id, text)
      if (renown.step === 1) await ars8(bot, chat_id, renown._id, text)
      if (renown.step === 2) await ars9(bot, chat_id, renown._id, text)
      if (renown.step === 3) await ars10(bot, chat_id, renown._id, text)
    }
  }
}

module.exports = {adminRenowns, ars0, ars3, ars4, ars5}
