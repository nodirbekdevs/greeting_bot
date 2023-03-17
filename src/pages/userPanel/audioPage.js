const FFMPEG = require('fluent-ffmpeg')
const {existsSync} = require('fs')
const {mkdir} = require('fs/promises')
const {join} = require('node:path')
const kb = require('./../../helpers/keyboard-buttons')
const keyboard = require('./../../helpers/keyboard')
const config = require('./../../helpers/config')
const {getAudios, getAudio, makeAudio, updateAudio, deleteAudio} = require('./../../controllers/audioController')
const {getRenowns, getRenown, updateRenown} = require('./../../controllers/renownController')
const {getPoems, getPoem, updatePoem} = require('./../../controllers/poemController')
const {getFelicitations, getFelicitation, updateFelicitation} = require('./../../controllers/felicitationController')
const {getMusics, getMusic, updateMusic} = require('./../../controllers/musicController')
const {report, poem_pagination, felicitation_pagination, music_pagination} = require('./../../helpers/utils')
const {getUser} = require('./../../controllers/userController')

let audio_id

const uas0 = async (bot, chat_id, lang) => {
  let message, kbb

  if (lang === kb.language.uz) {
    message = "Tabriklar bo'limi"
    kbb = {reply_markup: {resize_keyboard: true, keyboard: keyboard.user.felicitations.uz}}
  } else if (lang === kb.language.ru) {
    message = "Раздел поздравления"
    kbb = {reply_markup: {resize_keyboard: true, keyboard: keyboard.user.felicitations.ru}}
  }

  await bot.sendMessage(chat_id, message, kbb)
}

// const uus1 = async (bot, chat_id, lang) => {
//   const query = {author: chat_id, status: 'active'}, message = lang === kb.language.uz
//     ? 'Hozirgacha olgan audiolaringiz'
//     : "Аудио, которые вы уже получили"
//
//   const report = await audio_user_pagination(1, 6, query, lang)
//
//   if (report.kw === 'YES') {
//     await bot.sendMessage(chat_id, report.text, report.kbs)
//
//     await bot.sendMessage(chat_id, message)
//   } else if (report.kw === 'NO') {
//     await bot.sendMessage(chat_id, report.text, report.kbs)
//   }
// }
//
// const uus2 = async (bot, chat_id, message_id, data, _id,  lang) => {
//   let query
//
//   if ((data[0] === 'left' || data[0] === 'right') && data[1] === 'selfeedback') {
//     query = {is_read: false, status: 'active'}
//   }
//
//   if ((data[0] === 'left' || data[0] === 'right') && data[1] === 'dofeedback') {
//     query = {is_read: true, status: 'seen'}
//   }
//
//   const report = await audio_user_pagination(parseInt(data[2]), 6, query, lang), kbb = report.kbs.reply_markup
//
//   await bot.editMessageText(report.text, {chat_id, message_id, parse_mode: 'HTML', reply_markup: kbb})
// }
//
// const uus3 = async (bot, chat_id, message_id, _id,  lang) => {
//   const audio = await getAudio({_id}), message = report(audio, 'AUDIO', lang)
//
//   await bot.editMessageMedia({type: 'audio', media: audio.file, caption: message, parse_mode: 'HTML'}, {
//     chat_id, message_id, reply_markup: {
//       inline_keyboard: [[{text: kb.options.back.uz, callback_data: JSON.stringify({phrase: 'au_back', id: ''})}]]
//     }
//   })
// }

const uas1 = async (bot, chat_id, lang) => {
  let message, kbb

  const renowns = await getRenowns({status: 'active'}), felicitations = await getFelicitations({status: 'active'}),
    poems = await getPoems({status: 'active'}), musics = await getMusics({status: 'active'})

  if (renowns.length > 0 && felicitations.length > 0 && poems.length > 0 && musics.length > 0) {
    const new_audio = await makeAudio({author: chat_id})
    audio_id = new_audio._id

    if (lang === kb.language.uz) {
      message = "Bu tabrik kim uchun ?"
      kbb = keyboard.options.types_relations
    } else if (lang === kb.language.ru) {
      message = "Для кого это приветствие?"
      kbb = keyboard.options.types_relations
    }
  } else if (renowns.length <= 0 || felicitations.length <= 0 || poems.length <= 0 || musics.length <= 0) {
    if (lang === kb.language.uz) {
      message = "Hali audiolar yoza olmaysiz ishlar tugatilmagan."
      kbb = keyboard.user.pages.uz
    } else if (lang === kb.language.ru) {
      message = "Вы пока не можете записывать аудио."
      kbb = keyboard.user.pages.ru
    }
  }

  await bot.sendMessage(chat_id, message, {reply_markup: {resize_keyboard: true, keyboard: kbb}})
}

const uas2 = async (bot, chat_id, _id, text, lang) => {
  let message, kbb

  await updateAudio({_id}, {type: text, step: 1})

  const path = join(__dirname, `${kb.options.paths.felicitation}/${text}`)

  if (!existsSync(path)) await mkdir(join(__dirname, kb.options.paths.audio, `/${text}`))

  if (lang === kb.language.uz) {
    message = "Tabriklanuvchi odamni ismini kiriting ?"
    kbb = keyboard.options.back.uz
  } else if (lang === kb.language.ru) {
    message = "Введите имя получателя ?"
    kbb = keyboard.options.back.ru
  }

  await bot.sendMessage(chat_id, message, {reply_markup: {resize_keyboard: true, keyboard: kbb}})
}

const uas3 = async (bot, chat_id, _id, text, lang) => {
  let message, kbb

  const renown = await getRenown({name: text, status: 'active'})

  if (renown) {
    await updateAudio({_id}, {renown: text, step: 2})

    if (lang === kb.language.uz) {
      message = "Tabriklovchi odamni ismini kiriting ?"
      kbb = keyboard.options.back.uz
    } else if (lang === kb.language.ru) {
      message = "Введите имя поздравителя ?"
      kbb = keyboard.options.back.ru
    }
  } else if (!renown) {
    await deleteAudio({_id})

    if (lang === kb.language.uz) {
      message = "Bu ism topilmadi. Iltimos bir ozdan so'ng harakat qilib ko'ring ?"
      kbb = keyboard.user.pages.uz
    } else if (lang === kb.language.ru) {
      message = "Это имя не найдено. Пожалуйста, повторите попытку позже ?"
      kbb = keyboard.user.pages.ru
    }

    await bot.sendMessage(config.admin_id, `${text} bu ism topilmadi. Qo'shib qo'ying`)
  }

  await bot.sendMessage(chat_id, message, {reply_markup: {resize_keyboard: true, keyboard: kbb}})
}

const uas4 = async (bot, chat_id, _id, text, lang) => {
  let message, kbb

  const audio = await getAudio({_id, status: 'active'}), renown = await getRenown({name: text, status: 'active'})

  if (renown) {
    await updateAudio({_id}, {son_name: text, step: 3})

    message = lang === kb.language.uz ? "Tabriklovchi odam uchun sher tanlang ?" : "Введите имя поздравителя ?"

    const poems = await poem_pagination(1, 6, {type: audio.type, status: 'active'}, 'AUDIO')

    await bot.sendMessage(chat_id, poems.text, poems.kbs)
  } else if (!renown) {
    await deleteAudio({_id})

    message = lang === kb.language.uz
      ? "Bu ism topilmadi. Iltimos bir ozdan so'ng harakat qilib ko'ring ?"
      : "Это имя не найдено. Пожалуйста, повторите попытку позже ?"

    await bot.sendMessage(config.admin_id, `${text} bu ism topilmadi. Qo'shib qo'ying`)
  }

  await bot.sendMessage(chat_id, message)
}

const uas5 = async (bot, chat_id, message_id, data) => {
  let message

  const audio = await getAudio({author: chat_id, status: 'process'}), query = {type: audio.type, status: 'active'}

  if (data[1] === 'poems') message = await poem_pagination(parseInt(data[2]), 6, query, 'AUDIO')
  if (data[1] === 'felicitations') message = await felicitation_pagination(parseInt(data[2]), 6, query, 'AUDIO')
  if (data[1] === 'musics') message = await music_pagination(parseInt(data[2]), 6, query, 'AUDIO')

  await bot.editMessageText(message.text, {chat_id, message_id, parse_mode: 'HTML', reply_markup: message.kbs})
}

const uas6 = async (bot, chat_id, message_id, phrase, _id, lang) => {
  let clause, back, data, message, kws, kwb

  if (phrase === 'spoem') {
    data = await getPoem({_id})
    message = report(data, 'POEM', lang)
    kws = 'sel_po'
    kwb = 'po_back'
  } else if (phrase === 'sfelicitation') {
    data = await getFelicitation({_id})
    message = report(data, 'Felicitation', lang)
    kws = 'sel_fe'
    kwb = 'fe_back'
  } else if (phrase === 'smusic') {
    data = await getMusic({_id})
    message = report(data, 'Felicitation', lang)
    kws = 'sel_mu'
    kwb = 'mu_back'
  }

  if (lang === kb.language.uz) {
    clause = "Tanlash"
    back = kb.options.back.uz
  } else if (lang === kb.language.ru) {
    clause = "Выбирать"
    back = kb.options.back.ru
  }

  await bot.editMessageMedia({type: 'audio', media: data.file, caption: message, parse_mode: 'HTML'}, {
    chat_id, message_id, reply_markup: {
      inline_keyboard: [
        [{text: clause, callback_data: JSON.stringify({phrase: kws, id: data._id})}],
        [{text: back, callback_data: JSON.stringify({phrase: kwb, id: ''})}],
      ]
    }
  })
}

const uas7 = async (bot, chat_id, message_id, data, _id, lang) => {
  let message, dope

  const audio = await getAudio({author: chat_id, status: 'process'}), riven = data.split('_'),
    query = {type: audio.type, status: 'active'}

  if (riven[0] === 'sel') {
    let page, kbb, updated

    await bot.deleteMessage(chat_id, message_id)

    if (riven[1] === 'po') {
      dope = await getPoem({_id})
      updated = {poem: dope.title, step: 4}
      page = await felicitation_pagination(1, 6, query, 'AUDIO')
    } else if (riven[1] === 'fe') {
      dope = await getFelicitation({_id})
      updated = {felicitation: dope.title, step: 5}
      page = await music_pagination(1, 6, query, 'AUDIO')
    } else if (riven[1] === 'mu') {
      dope = await getMusic({_id})
      updated = {music: dope.name, step: 6}
      message = report(data, 'AUDIO_MAKING', kb.language.uz)
      kbb = lang === kb.language.uz ? keyboard.options.confirmation.uz : keyboard.options.confirmation.ru
    }

    await updateAudio({_id: audio._id}, updated)

    if (page) await bot.sendMessage(chat_id, page.text, page.kbs)
    else await bot.sendMessage(chat_id, message, {reply_markup: {resize_keyboard: true, keyboard: kbb}})
  }

  if (riven[1] === 'back') {
    if (riven[0] === 'po') {
      dope = await poem_pagination(1, 6, query, 'AUDIO')
    } else if (riven[0] === 'fe') {
      dope = await felicitation_pagination(1, 6, query, 'AUDIO')
    } else if (riven[0] === 'mu') {
      dope = await music_pagination(1, 6, query, 'AUDIO')
    }

    await bot.editMessageText(dope.text, {chat_id, message_id, parse_mode: 'HTML', reply_markup: dope.kbs})
  }
}

const uas8 = async (bot, chat_id, _id, text, lang) => {
  let message, content, audio = await getAudio({_id})

  const user = await getUser({telegram_id: chat_id})

  if (text === kb.options.confirmation.uz) {
    const congratulated = await getRenown({name: audio.renown, status: 'active'})
    const congratulatory = await getRenown({name: audio.son_name, status: 'active'})
    const poem = await getPoem({title: audio.poem, status: 'active'})
    const felicitation = await getFelicitation({title: audio.felicitation, status: 'active'})
    const music = await getMusic({title: audio.name, status: 'active'})

    const file_name = `${congratulated}_${congratulatory}_${poem.title}_${felicitation.title}_${music.name}`

    let audio_path = join(__dirname, `${kb.options.paths.audio}/${audio.type}/${file_name}`)

    audio = await getAudio({name: file_name, file: audio_path, step: 7, status: 'active'})

    if (!existsSync(audio_path) && !audio) {
      audio = await getAudio({_id})

      const congratulated_path = join(congratulated.file), congratulatory_path = join(congratulatory.file),
        poem_path = join(poem.file), felicitation_path = join(felicitation.file), music_path = join(music.file)

      let congratulation = felicitation.content

      congratulation.replace('TABRIKLANUVCHI', congratulated.name);
      congratulation.replace('TABRIKLOVCHI', congratulatory.name);

      content = `${poem.content}\n\n`
      content += `${congratulation}\n\n`
      content += `${music.content}`

      audio_path = join(__dirname, `${kb.options.paths.audio}/${audio.type}/${file_name}`)

      const command = new FFMPEG();

      command.setFfmpegPath(config.ffmpeg_path);
      command.setFfprobePath(config.ffprobe_path);


      await updateRenown({_id: congratulated._id}, {$inc: {total_audios: 1}})
      await updateRenown({_id: congratulatory._id}, {$inc: {total_audios: 1}})
      await updatePoem({_id: poem._id}, {$inc: {total_audios: 1}})
      await updateFelicitation({_id: felicitation._id}, {$inc: {total_audios: 1}})
      await updateMusic({_id: music._id}, {$inc: {total_audios: 1}})

      await updateAudio({_id: audio._id}, {name: file_name, content, file: audio_path, step: 7, status: 'active'})
      // audio.name = file_name
      // audio.content = content
      // audio.file = audio_path
      // audio.step = 7
      // audio.status = 'active'
      // await audio.save()
    }

    if (existsSync(audio_path) && audio) await deleteAudio({_id})

    await bot.sendAudio(chat_id, audio_path)

    user.audios.push(audio._id)
    user.total_audios += 1
    await user.save()

    message = "Tabrik muvaffaqqiyatli qo'shildi mp3 varianti bilan"
  } else if (text === kb.options.not_to_confirmation.uz) {
    await deleteAudio({_id})

    message = "Audio muvaffaqqiyatli qo'shilmadi"
  }

  await bot.sendMessage(chat_id, message, {
    reply_markup: {resize_keyboard: true, keyboard: keyboard.admin.felicitations, one_time_keyboard: true}
  })
}

const uas9 = async (bot, chat_id, _id, lang) => {
  let message, kbb

  await deleteAudio({_id})

  if (lang === kb.language.uz) {
    message = "Yangi tabrikov qo'shilmadi"
    kbb = keyboard.user.pages.uz
  } else if (lang === kb.language.ru) {
    message = "Новое поздравления не добавлено"
    kbb = keyboard.user.pages.ru
  }

  await bot.sendMessage(chat_id, message, {reply_markup: {resize_keyboard: true, keyboard: kbb}})
}

const userAudios = async (bot, chat_id, text, lang) => {
  const audio = await getAudio({_id: audio_id, status: 'process'})
    ? await getAudio({_id: audio_id, status: 'process'})
    : (await getAudios({author: chat_id, status: 'process'}))[0]

  try {
    if (text === kb.user.pages.uz.felicitations || text === kb.user.pages.ru.felicitations) await uas0(bot, chat_id, lang)
    else if (text === kb.user.felicitations.uz.add || text === kb.user.felicitations.ru.add) await uas1(bot, chat_id, lang)
    // else if (text === kb.user.felicitations.uz.all || text === kb.user.felicitations.ru.all) await ufs4(bot, chat_id, lang)

    if (audio) {
      if (text === kb.options.back.uz || text === kb.options.back.ru) {
        await uas9(bot, chat_id, audio._id, lang)
      } else if (text !== kb.options.back.uz || text !== kb.options.back.ru) {
        if (audio.step === 0) await uas2(bot, chat_id, audio._id, text, lang)
        if (audio.step === 1) await uas3(bot, chat_id, audio._id, text, lang)
        if (audio.step === 2) await uas4(bot, chat_id, audio._id, text, lang)
        if (audio.step === 6) await uas8(bot, chat_id, audio._id, text, lang)
      }
    }
  } catch (e) {
    console.log(e)
  }
}

module.exports = {userAudios, uas0, uas5, uas6, uas7}
