const kb = require('./../../helpers/keyboard-buttons')
const keyboard = require('./../../helpers/keyboard')
const {mkdir, existsSync} = require('fs')
const {getPoems, getPoem, makePoem, updatePoem, deletePoem} = require('./../../controllers/poemController')
const {getAdmin, updateAdmin} = require('./../../controllers/adminController')
const {report, poem_pagination} = require('./../../helpers/utils')

let poem_id

const aps0 = async (bot, chat_id) => {
  await bot.sendMessage(chat_id, "Sherlar sahifasi", {
    reply_markup: {resize_keyboard: true, keyboard: keyboard.admin.poems, one_time_keyboard: true}
  })
}

const aps1 = async (bot, chat_id) => {
  await updateAdmin({telegram_id: chat_id}, {step: 3})

  await bot.sendMessage(chat_id, "Kim uchun sherlarni ko'rmoqchisiz", {
    reply_markup: {resize_keyboard: true, keyboard: keyboard.options.types, one_time_keyboard: true}
  })
}

const aps2 = async (bot, chat_id, text) => {
  const query = {author: chat_id, type: text, status: 'active'}, report = await poem_pagination(1, 6, query)

  await updateAdmin({telegram_id: chat_id}, {situation: `POEM_${text}`})

  await bot.sendMessage(chat_id, report.text, report.kbs)
}

const aps3 = async (bot, chat_id, message_id, data) => {
  let query, report

  const type = (await getAdmin({telegram_id: chat_id})).situation.split('_')

  if ((data[0] === 'left' || data[0] === 'right') && data[1] === 'poems') {
    query = {author: chat_id, type: type[1], status: 'active'}

    report = await poem_pagination(parseInt(data[2]), 6, query)
  }

  if (report) {
    const kbb = report.kbs

    await bot.editMessageText(report.text, {chat_id, message_id, parse_mode: 'HTML', reply_markup: kbb})
  }
}

const aps4 = async (bot, chat_id, message_id, _id) => {
  const poem = await getPoem({_id}), message = report(poem, 'POEM', kb.language.uz)

  await bot.editMessageMedia({
      type: 'audio', media: {type: 'audio', media: `${poem.file}`}, caption: message, parse_mode: 'HTML',
      reply_markup: [[{text: kb.options.back.uz, callback_data: JSON.stringify({phrase: 'po_back', id: ''})}]]
    }, {chat_id, message_id}
  )
}

const aps5 = async (bot, chat_id, message_id) => {
  const type = (await getAdmin({telegram_id: chat_id})).situation.split('_'),
    query = {author: chat_id, type: type[1], status: 'active'}, report = await poem_pagination(1, 6, query)

  await bot.editMessageText(report.text, {
    chat_id,
    message_id,
    parse_mode: 'HTML',
    reply_markup: report.kbs.reply_markup
  })
}

const aps6 = async (bot, chat_id) => {
  const new_poem = await makePoem({author: chat_id})
  poem_id = new_poem._id

  await bot.sendMessage(chat_id, "Sherning kim haqida ekanini tanlang", {
    reply_markup: {resize_keyboard: true, keyboard: keyboard.options.types, one_time_keyboard: true}
  })
}

const aps7 = async (bot, chat_id, _id, text) => {
  await updatePoem({_id}, {type: text, step: 1})

  const path = `${kb.options.paths.poem}/${text}`

  if (!existsSync(path)) await mkdir(path, {recursive: true})

  await bot.sendMessage(chat_id, "Sherning sarlavhasini jo'nating", {
    reply_markup: {resize_keyboard: true, keyboard: keyboard.options.back.uz, one_time_keyboard: true}
  })
}

const aps8 = async (bot, chat_id, _id, text) => {
  await updatePoem({_id}, {title: text, step: 2})

  await bot.sendMessage(chat_id, "Sherni jo'nating", {
    reply_markup: {resize_keyboard: true, keyboard: keyboard.options.back.uz, one_time_keyboard: true}
  })
}

const aps9 = async (bot, chat_id, _id, text) => {
  await updatePoem({_id}, {content: text, step: 3})

  await bot.sendMessage(chat_id, "Sherni mp3 faylini jo'nating", {
    reply_markup: {resize_keyboard: true, keyboard: keyboard.options.back.uz, one_time_keyboard: true}
  })
}

const aps10 = async (bot, chat_id, _id, text) => {
  await updatePoem({_id}, {telegram_link: text, step: 4})

  const poem = await getPoem({_id})

  let message = report(poem, 'POEM', kb.language.uz)

  message += `\n\nTugaganini tasdiqlaysizmi ?`

  await bot.sendMessage(chat_id, message, {
    reply_markup: {resize_keyboard: true, keyboard: keyboard.options.confirmation.uz, one_time_keyboard: true}
  })
}

const aps11 = async (bot, chat_id, _id, text) => {
  let message

  const poem = await getPoem({_id})

  if (text === kb.options.confirmation.uz) {
    await updatePoem({_id}, {telegram_link: text, step: 4})

    const path = `${kb.options.paths.poem}/${poem.type}/${poem.title}.mp3`

    await bot.downloadFile(poem.telegram_link, path)

    await updatePoem({_id}, {file: path, step: 5, status: 'active'})

    message = "Sher muvaffaqqiyatli qo'shildi mp3 varianti bilan"
  } else if (text === kb.options.not_to_confirmation.uz) {
    await deletePoem({_id})

    message = "Sher muvaffaqqiyatli qo'shilmadi"
  }

  await bot.sendMessage(chat_id, message, {
    reply_markup: {resize_keyboard: true, keyboard: keyboard.admin.poems, one_time_keyboard: true}
  })
}

const aps12 = async (bot, chat_id, _id) => {
  await deletePoem({_id})

  await bot.sendMessage(chat_id, "Sher muvaffaqqiyatli qo'shilmadi",
    {reply_markup: {resize_keyboard: true, keyboard: keyboard.admin.poems}}
  )
}

const adminPoems = async (bot, chat_id, text) => {
  const admin = await getAdmin({telegram_id: chat_id})

  const poem = await getPoem({_id: poem_id, author: chat_id, status: 'process'})
    ? await getPoem({_id: poem_id, author: chat_id, status: 'process'})
    : (await getPoems({author: chat_id, status: 'process'}))[0]

  if (text === kb.admin.pages.poems) await aps0(bot, chat_id)
  if (text === kb.admin.poems.all) await aps1(bot, chat_id)
  if (text === kb.admin.poems.add) await aps6(bot, chat_id)

  if (admin.step === 3) await aps2(bot, chat_id, text)

  if (poem) {
    if (text === kb.options.back.uz || text === kb.options.back.ru) {
      await aps12(bot, chat_id, poem._id)
    } else if (text !== kb.options.back.uz || text !== kb.options.back.ru) {
      if (poem.step === 0) await aps7(bot, chat_id, poem._id, text)
      if (poem.step === 1) await aps8(bot, chat_id, poem._id, text)
      if (poem.step === 2) await aps9(bot, chat_id, poem._id, text)
      if (poem.step === 3) await aps10(bot, chat_id, poem._id, text)
      if (poem.step === 4) await aps11(bot, chat_id, poem._id, text)
    }
  }
}

module.exports = {adminPoems, aps3, aps4, aps5}
