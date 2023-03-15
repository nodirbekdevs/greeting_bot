const kb = require('./../../helpers/keyboard-buttons')
const keyboard = require('./../../helpers/keyboard')
const {mkdir} = require('fs/promises')
const {existsSync} = require('fs')
const {rename, readFile} = require('fs/promises')
const {join} = require('node:path')
const {getMusics, getMusic, makeMusic, updateMusic, deleteMusic} = require('./../../controllers/musicController')
const {getAdmin, updateAdmin} = require('./../../controllers/adminController')
const {report, music_pagination} = require('./../../helpers/utils')

let music_id

const ams0 = async (bot, chat_id) => {
  await bot.sendMessage(chat_id, "Musiqalar sahifasi", {
    reply_markup: {resize_keyboard: true, keyboard: keyboard.admin.musics, one_time_keyboard: true}
  })
}

const ams1 = async (bot, chat_id) => {
  await updateAdmin({telegram_id: chat_id}, {step: 7})

  await bot.sendMessage(chat_id, "Kim uchun musiqa ko'rmoqchisiz", {
    reply_markup: {resize_keyboard: true, keyboard: keyboard.options.types_relations, one_time_keyboard: true}
  })
}

const ams2 = async (bot, chat_id, text) => {
  const query = {author: chat_id, type: text, status: 'active'}, report = await music_pagination(1, 6, query)

  await updateAdmin({telegram_id: chat_id}, {situation: `MUSIC_${text}`})

  await bot.sendMessage(chat_id, report.text, report.kbs)
}

const ams3 = async (bot, chat_id, message_id, data) => {
  let query, report

  const type = (await getAdmin({telegram_id: chat_id})).situation.split('_')

  if ((data[0] === 'left' || data[0] === 'right') && data[1] === 'musics') {
    query = {author: chat_id, type: type[1], status: 'active'}

    report = await music_pagination(parseInt(data[2]), 6, query)
  }

  if (report) {
    const kbb = report.kbs

    await bot.editMessageText(report.text, {chat_id, message_id, parse_mode: 'HTML', reply_markup: kbb})
  }
}

const ams4 = async (bot, chat_id, message_id, _id) => {
  const music = await getMusic({_id}), message = report(music, 'MUSIC', kb.language.uz)

  await bot.editMessageMedia({type: 'audio', media: music.file, caption: message, parse_mode: 'HTML'}, {
    chat_id, message_id, reply_markup: {
      inline_keyboard: [[{text: kb.options.back.uz, callback_data: JSON.stringify({phrase: 'mu_back', id: ''})}]]
    }
  })
}

const ams5 = async (bot, chat_id, message_id) => {
  const type = (await getAdmin({telegram_id: chat_id})).situation.split('_'),
    query = {author: chat_id, type: type[1], status: 'active'}, report = await music_pagination(1, 6, query)

  await bot.editMessageText(report.text, {
    chat_id, message_id, parse_mode: 'HTML', reply_markup: report.kbs.reply_markup
  })
}

const ams6 = async (bot, chat_id) => {
  const new_music = await makeMusic({author: chat_id})
  music_id = new_music._id

  await bot.sendMessage(chat_id, "Musiqa kim haqida ekanini tanlang", {
    reply_markup: {resize_keyboard: true, keyboard: keyboard.options.types_relations, one_time_keyboard: true}
  })
}

const ams7 = async (bot, chat_id, _id, text) => {
  await updateMusic({_id}, {type: text, step: 1})

  const path = join(__dirname, `${kb.options.paths.music}/${text}`), checking = existsSync(path)

  if (!checking) await mkdir(join(__dirname, kb.options.paths.music, `/${text}`))

  await bot.sendMessage(chat_id, "Musiqaning nomini jo'nating", {
    reply_markup: {resize_keyboard: true, keyboard: keyboard.options.back.uz, one_time_keyboard: true}
  })
}

const ams8 = async (bot, chat_id, _id, text) => {
  await updateMusic({_id}, {name: text, step: 2})

  await bot.sendMessage(chat_id, "Musiqani matnini jo'nating", {
    reply_markup: {resize_keyboard: true, keyboard: keyboard.options.back.uz, one_time_keyboard: true}
  })
}

const ams9 = async (bot, chat_id, _id, text) => {
  await updateMusic({_id}, {content: text, step: 3})

  await bot.sendMessage(chat_id, "Musiqani mp3 faylini jo'nating", {
    reply_markup: {resize_keyboard: true, keyboard: keyboard.options.back.uz, one_time_keyboard: true}
  })
}

const ams10 = async (bot, chat_id, _id, text) => {
  await updateMusic({_id}, {telegram_link: text, step: 4})

  const music = await getMusic({_id})

  let message = report(music, 'MUSIC', kb.language.uz)

  message += `\n\nTugaganini tasdiqlaysizmi ?`

  await bot.sendMessage(chat_id, message, {
    reply_markup: {resize_keyboard: true, keyboard: keyboard.options.confirmation.uz, one_time_keyboard: true}
  })
}

const ams11 = async (bot, chat_id, _id, text) => {
  let message

  const music = await getMusic({_id})

  if (text === kb.options.confirmation.uz) {
    const new_path = join(__dirname, `${kb.options.paths.music}/${music.type}/${music.name}.mp3`)

    const downloaded_path = await bot.downloadFile(music.telegram_link, join(__dirname, `${kb.options.paths.felicitation}/${music.type}/`))

    const old_path = join(downloaded_path)

    await rename(old_path, new_path)

    await updateMusic({_id}, {file: new_path, step: 5, status: 'active'})

    message = "Musiqa muvaffaqqiyatli qo'shildi mp3 varianti bilan"
  } else if (text === kb.options.not_to_confirmation.uz) {
    await deleteMusic({_id})

    message = "Musiqa muvaffaqqiyatli qo'shilmadi"
  }

  await bot.sendMessage(chat_id, message, {
    reply_markup: {resize_keyboard: true, keyboard: keyboard.admin.felicitations, one_time_keyboard: true}
  })
}

const ams12 = async (bot, chat_id, _id) => {
  await deleteMusic({_id})

  await bot.sendMessage(chat_id, "Musiqa muvaffaqqiyatli qo'shilmadi",
    {reply_markup: {resize_keyboard: true, keyboard: keyboard.admin.poems}}
  )
}

const adminMusics = async (bot, chat_id, text) => {
  const admin = await getAdmin({telegram_id: chat_id})

  const music = await getMusic({_id: music_id, author: chat_id, status: 'process'})
    ? await getMusic({_id: music_id, author: chat_id, status: 'process'})
    : (await getMusics({author: chat_id, status: 'process'}))[0]

  if (text === kb.admin.pages.musics) await ams0(bot, chat_id)
  if (text === kb.admin.musics.all) await ams1(bot, chat_id)
  if (text === kb.admin.musics.add) await ams6(bot, chat_id)

  if (admin.step === 6) {
    if (text === kb.options.back.uz) {
      await updateAdmin({telegram_id: chat_id}, {situation: '', step: 0})
      await ams0(bot, chat_id)
    }
    if (text !== kb.options.back.uz) await ams2(bot, chat_id, text)
  }

  if (music) {
    if (text === kb.options.back.uz || text === kb.options.back.ru) {
      await ams12(bot, chat_id, music._id)
    } else if (text !== kb.options.back.uz || text !== kb.options.back.ru) {
      if (music.step === 0) await ams7(bot, chat_id, music._id, text)
      if (music.step === 1) await ams8(bot, chat_id, music._id, text)
      if (music.step === 2) await ams9(bot, chat_id, music._id, text)
      if (music.step === 3) await ams10(bot, chat_id, music._id, text)
      if (music.step === 4) await ams11(bot, chat_id, music._id, text)
    }
  }
}

module.exports = {adminMusics, ams0, ams3, ams4, ams5}
