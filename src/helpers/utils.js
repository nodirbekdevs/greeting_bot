const kb = require('./keyboard-buttons')
const keyboard = require('./keyboard')
const {getPoems, getPoemPagination, getPoem} = require('./../controllers/poemController')
const {getRenowns, getRenownPagination, getRenown} = require('./../controllers/renownController')
const {getFelicitations, getFelicitationPagination, getFelicitation} = require('./../controllers/felicitationController')
const {getMusics, getMusicPagination, getMusic} = require('./../controllers/musicController')
const {getAllFeedback, getFeedbackPagination} = require('./../controllers/feedbackController')
const {getUser} = require('./../controllers/userController')


const report = (data, kw, lang) => {
  let message = ''

  if (kw === 'ADMIN') {
    message += 'Ma\'lumotlaringiz: \n'
    message += `Ismingiz - ${data.name}.\n`
    message += `Telefon raqamingiz - ${data.number}.\n`
    message += `Username - ${data.username}.\n`
    message += `\nNimani o'zgartirmoqchisiz`
  }

  if (kw === 'FEEDBACK_ALL') {
    if (lang === kb.language.uz) {
      message += `Umumiy izohlar soni - ${data.number}\n`
      message += `Tugallanmagan izohlar soni - ${data.process}\n`
      message += `Qabul qilingan izohlar soni - ${data.active}\n`
      message += `Qabul qilinmagan izohlar soni - ${data.inactive}\n`
      message += `\nKo'rilgan izohlar soni - ${data.seen}\n`
      message += `Amalga oshirilgan izohlar soni - ${data.done}`
    } else if (lang === kb.language.ru) {
      message += `Общее количество комментариев - ${data.number}\n`
      message += `Количество неполных комментариев - ${data.process}\n`
      message += `Количество полученных комментариев - ${data.active}\n`
      message += `Количество неполученных комментариев - ${data.inactive}\n`
      message += `\nКоличество просмотренных комментариев - ${data.seen}\n`
      message += `Количество сделанных комментариев - ${data.done}`
    }
  }
  if (kw === 'FEEDBACK') {
    if (lang === kb.language.uz) {
      message += `Avtor - ${data.author}\n`
      message += `Bahosi - ${data.mark}\n`
      message += `Sababi - ${data.reason}\n`
      message += `Holati - ${data.status}\n`
      message += `Yozilgan vaqti - ${data.created_at}`
    } else if (lang === kb.language.ru) {
      message += `Автор - ${data.author}\n`
      message += `Рейтинг - ${data.mark}\n`
      message += `Причина - ${data.reason}\n`
      message += `Статус - ${data.status}`
      message += `Записанное время - ${data.created_at}`
    }
  }
  if (kw === 'FEEDBACK_SEEN') {
    if (lang === kb.language.uz) {
      message += `Assalomu Aleykum ${data.name}\n`
      message += `Siz yozgan izoh ustida ishlar boshlandi\n`
      message += `Izoh - ${data.feedback}`
    } else if (lang === kb.language.ru) {
      message += `Assalomu Aleykum ${data.name}\n`
      message += `Ваш комментарий обработан\n`
      message += `Комментария - ${data.feedback}`
    }
  }
  if (kw === 'FEEDBACK_DONE') {
    if (lang === kb.language.uz) {
      message += `Assalomu Aleykum ${data.name}\n`
      message += `Siz yozgan izoh ustida ishlar tugallandi. Muammo bartaraf etildi\n`
      message += `Izoh - ${data.feedback}`
    } else if (lang === kb.language.ru) {
      message += `Assalomu Aleykum ${data.name}\n`
      message += `Ваш комментарий обработан. Проблема решена\n`
      message += `Комментария - ${data.feedback}`
    }
  }

  if (kw === "ADVERTISING") {
    message += `<b>${data.title}</b>\n`
    message += `\n<pre>${data.description}</pre>`
  }

  if (kw === "POEM") {
    message += `<b>${data.title}</b>\n`
    message += `\n<pre>${data.content}</pre>`
  }

  if (kw === "FELICITATION") {
    message += `<b>${data.title}</b>\n`
    message += `\n<pre>${data.content}</pre>`
  }

  if (kw === "MUSIC") {
    message += `<b>${data.name}</b>\n`
    message += `\n<pre>${data.content}</pre>`
  }

  return message
}

const poem_pagination = async (page, limit, query) => {
  let offset = limit * (page - 1), text, kbs, kw

  const poems = await getPoemPagination(query, offset, limit), all_poems = await getPoems(query)

  if (poems.length > 0) {
    text = `<b>Hozirgi: ${offset + 1}-${poems.length + offset}, Jami:${all_poems.length}</b>\n\n`

    let kbb = [], arr = []

    for (let i = 0; i < poems.length; i++) {
      const poem = poems[i]

      const obj = {text: `${i + 1}`, callback_data: JSON.stringify({phrase: 'spoem', id: poem._id})}

      arr.push(obj)

      if (arr.length % 6 === 0) {
        kbb.push(arr)
        arr = []
      }

      text += `<b>${i + 1}.</b> ${poem.title}\n`
    }

    kbb.push(arr)

    const inline_keyboard = [
      {text: `⬅️`, callback_data: JSON.stringify({phrase: page !== 1 ? `left#poems#${page - 1}` : 'none', id: ''})},
      {text: `❌`, callback_data: JSON.stringify({phrase: `delete`, id: ''})},
      {
        text: ` ➡️`,
        callback_data: JSON.stringify({
          phrase: poems.length + offset !== all_poems.length ? `right#poems#${page + 1}` : 'none', id: ''
        })
      }
    ]

    kbb.push(inline_keyboard)

    kbs = {parse_mode: 'HTML', reply_markup: {inline_keyboard: kbb}}
  } else if (poems.length <= 0) {
    text = "Hozircha bu tip uchun sherlar qo'shilmagan"
    kbs = {reply_markup: {resize_keyboard: true, keyboard: keyboard.options.types_relations}}
  }

  return {text, kbs}
}

const renown_pagination = async (page, limit, query) => {
  let offset = limit * (page - 1), text, kbs, kw

  const renowns = await getRenownPagination(query, offset, limit), all_renowns = await getRenowns(query)

  if (renowns.length > 0) {
    text = `<b>Hozirgi: ${offset + 1}-${renowns.length + offset}, Jami:${all_renowns.length}</b>\n\n`

    let kbb = [], arr = []

    for (let i = 0; i < renowns.length; i++) {
      const renown = renowns[i]

      const obj = {text: `${i + 1}`, callback_data: JSON.stringify({phrase: 'srenown', id: renown._id})}

      arr.push(obj)

      if (arr.length % 6 === 0) {
        kbb.push(arr)
        arr = []
      }

      text += `<b>${i + 1}.</b> ${renown.name}\n`
    }

    kbb.push(arr)

    const inline_keyboard = [
      {text: `⬅️`, callback_data: JSON.stringify({phrase: page !== 1 ? `left#renowns#${page - 1}` : 'none', id: ''})},
      {text: `❌`, callback_data: JSON.stringify({phrase: `delete`, id: ''})},
      {
        text: ` ➡️`,
        callback_data: JSON.stringify({
          phrase: renowns.length + offset !== all_renowns.length ? `right#renowns#${page + 1}` : 'none', id: ''
        })
      }
    ]

    kbb.push(inline_keyboard)

    kbs = {parse_mode: 'HTML', reply_markup: {inline_keyboard: kbb}}
  } else if (renowns.length <= 0) {
    text = "Hozircha bu tip uchun ismlar qo'shilmagan"
    kbs = {reply_markup: {resize_keyboard: true, keyboard: keyboard.options.types_gender}}
  }

  return {text, kbs}
}

const felicitation_pagination = async (page, limit, query) => {
  let offset = limit * (page - 1), text, kbs, kw

  const felicitations = await getFelicitationPagination(query, offset, limit), all_felicitations = await getFelicitations(query)

  if (felicitations.length > 0) {
    text = `<b>Hozirgi: ${offset + 1}-${felicitations.length + offset}, Jami:${all_felicitations.length}</b>\n\n`

    let kbb = [], arr = []

    for (let i = 0; i < felicitations.length; i++) {
      const felicitation = felicitations[i]

      const obj = {text: `${i + 1}`, callback_data: JSON.stringify({phrase: 'sfelicitation', id: felicitation._id})}

      arr.push(obj)

      if (arr.length % 6 === 0) {
        kbb.push(arr)
        arr = []
      }

      text += `<b>${i + 1}.</b> ${felicitation.name}\n`
    }

    kbb.push(arr)

    const inline_keyboard = [
      {text: `⬅️`, callback_data: JSON.stringify({phrase: page !== 1 ? `left#felicitations#${page - 1}` : 'none', id: ''})},
      {text: `❌`, callback_data: JSON.stringify({phrase: `delete`, id: ''})},
      {
        text: ` ➡️`,
        callback_data: JSON.stringify({
          phrase: felicitations.length + offset !== all_felicitations.length ? `right#felicitations#${page + 1}` : 'none', id: ''
        })
      }
    ]

    kbb.push(inline_keyboard)

    kbs = {parse_mode: 'HTML', reply_markup: {inline_keyboard: kbb}}
  } else if (felicitations.length <= 0) {
    text = "Hozircha bu tip uchun tabriklar qo'shilmagan"
    kbs = {reply_markup: {resize_keyboard: true, keyboard: keyboard.options.types_relations}}
  }

  return {text, kbs}
}

const music_pagination = async (page, limit, query) => {
  let offset = limit * (page - 1), text, kbs, kw

  const musics = await getMusicPagination(query, offset, limit), all_musics = await getMusics(query)

  if (musics.length > 0) {
    text = `<b>Hozirgi: ${offset + 1}-${musics.length + offset}, Jami:${all_musics.length}</b>\n\n`

    let kbb = [], arr = []

    for (let i = 0; i < musics.length; i++) {
      const music = musics[i]

      const obj = {text: `${i + 1}`, callback_data: JSON.stringify({phrase: 'smusic', id: musics._id})}

      arr.push(obj)

      if (arr.length % 6 === 0) {
        kbb.push(arr)
        arr = []
      }

      text += `<b>${i + 1}.</b> ${musics.name}\n`
    }

    kbb.push(arr)

    const inline_keyboard = [
      {text: `⬅️`, callback_data: JSON.stringify({phrase: page !== 1 ? `left#musics#${page - 1}` : 'none', id: ''})},
      {text: `❌`, callback_data: JSON.stringify({phrase: `delete`, id: ''})},
      {
        text: ` ➡️`,
        callback_data: JSON.stringify({
          phrase: musics.length + offset !== all_musics.length ? `right#musics#${page + 1}` : 'none', id: ''
        })
      }
    ]

    kbb.push(inline_keyboard)

    kbs = {parse_mode: 'HTML', reply_markup: {inline_keyboard: kbb}}
  } else if (musics.length <= 0) {
    text = "Hozircha bu tip uchun musiqalar qo'shilmagan"
    kbs = {reply_markup: {resize_keyboard: true, keyboard: keyboard.options.types_relations}}
  }

  return {text, kbs}
}

const pagination = async (page, limit, query, type) => {
  let offset = limit * (page - 1), text, kbs, clause, data, all_data

  if (type === 'POEM') {
    data = await getPoemPagination(query, offset, limit)
    all_data = await getPoems(query)
    clause = 'poems'
  } else if (type === 'RENOWN') {
    data = await getRenownPagination(query, offset, limit)
    all_data = await getRenowns(query)
    clause = 'renowns'
  } else if (type === 'FELICITATION'){
    data = await getFelicitationPagination(query, offset, limit)
    all_data = await getFelicitations(query)
    clause = 'felicitations'
  } else if (type === 'MUSIC') {
    data = await getMusicPagination(query, offset, limit)
    all_data = await getMusics(query)
    clause = 'musics'
  }

  if (data.length > 0) {
    let obj

    text = `<b>Hozirgi: ${offset + 1}-${data.length + offset}, Jami:${all_data.length}</b>\n\n`

    let kbb = [], arr = []

    for (let i = 0; i < data.length; i++) {
      const info = data[i]

      if (type === 'POEM') {
        obj = {text: `${i + 1}`, callback_data: JSON.stringify({phrase: 'spoem', id: info._id})}
      } else if (type === 'RENOWN') {
        obj = {text: `${i + 1}`, callback_data: JSON.stringify({phrase: 'srenown', id: info._id})}
      } else if (type === 'FELICITATION'){
        obj = {text: `${i + 1}`, callback_data: JSON.stringify({phrase: 'sfelicitation', id: info._id})}
      } else if (type === 'MUSIC') {
        obj = {text: `${i + 1}`, callback_data: JSON.stringify({phrase: 'smusic', id: info._id})}
      }

      arr.push(obj)

      if (arr.length % 6 === 0) {
        kbb.push(arr)
        arr = []
      }

      if (type === 'POEM') {
        text += `<b>${i + 1}.</b> ${info.title}\n`
      } else if (type === 'FELICITATION' || type === 'RENOWN' || type === 'MUSIC'){
        text += `<b>${i + 1}.</b> ${info.name}\n`
      }
    }

    kbb.push(arr)

    const inline_keyboard = [
      {text: `⬅️`, callback_data: JSON.stringify({phrase: page !== 1 ? `left#${clause}#${page - 1}` : 'none', id: ''})},
      {text: `❌`, callback_data: JSON.stringify({phrase: `delete`, id: ''})},
      {
        text: ` ➡️`,
        callback_data: JSON.stringify({
          phrase: data.length + offset !== all_data.length ? `right#${clause}#${page + 1}` : 'none', id: ''
        })
      }
    ]

    kbb.push(inline_keyboard)

    kbs = {parse_mode: 'HTML', reply_markup: {inline_keyboard: kbb}}
  } else if (data.length <= 0) {
    if (type === 'POEM') {
      text = "Hozircha bu tip uchun sherlar qo'shilmagan"
      kbs = {reply_markup: {resize_keyboard: true, keyboard: keyboard.options.types_relations}}
    } else if (type === 'RENOWN') {
      text = "Hozircha bu tip uchun ismlar qo'shilmagan"
      kbs = {reply_markup: {resize_keyboard: true, keyboard: keyboard.options.types_relations}}
    } else if (type === 'FELICITATION'){
      text = "Hozircha bu tip uchun tabriklar qo'shilmagan"
      kbs = {reply_markup: {resize_keyboard: true, keyboard: keyboard.options.types_relations}}
    } else if (type === 'MUSIC') {
      text = "Hozircha bu tip uchun musiqalar qo'shilmagan"
      kbs = {reply_markup: {resize_keyboard: true, keyboard: keyboard.options.types_relations}}
    }
  }

  return {text, kbs}
}

const feedback_seen_pagination = async (page, limit, query) => {
  let offset = limit * (page - 1), text, kbb = [], arr = [], kbs, kw

  const selected_feedback = await getFeedbackPagination(query, offset, limit),
    all_feedback = await getAllFeedback(query)

  if (selected_feedback.length > 0) {
    text = `<b>Hozirgi: ${offset + 1}-${selected_feedback.length + offset}, Jami:${all_feedback.length}</b>\n\n`

    for (let i = 0; i < selected_feedback.length; i++) {
      const feedback = selected_feedback[i], author = await getUser({telegram_id: feedback.author})

      const obj = {text: `${i + 1}`, callback_data: JSON.stringify({phrase: 'se_feed', id: feedback._id})}

      arr.push(obj)

      if (arr.length % 6 === 0) {
        kbb.push(arr)
        arr = []
      }

      text += `<b>${i + 1}.</b> ${author.name} - ${feedback.mark}\n`
    }

    kbb.push(arr)

    const inline_keyboard = [
      {
        text: `⬅️`,
        callback_data: JSON.stringify({phrase: page !== 1 ? `left#selfeedback#${page - 1}` : 'none', id: ''})
      },
      {text: `❌`, callback_data: JSON.stringify({phrase: `delete`, id: ''})},
      {
        text: ` ➡️`,
        callback_data: JSON.stringify({
          phrase: selected_feedback.length + offset !== all_feedback.length ? `right#selfeedback#${page + 1}` : 'none',
          id: ''
        })
      }
    ]

    kbb.push(inline_keyboard)

    kw = 'YES'

    kbs = {reply_markup: {inline_keyboard: kbb}}
  } else if (selected_feedback.length <= 0) {
    kw = 'NO'
    text = "Hali izohlar mavjud emas"
    kbs = {reply_markup: {resize_keyboard: true, keyboard: keyboard.admin.feedback}}
  }

  return {text, kbs, kw}
}
const feedback_done_pagination = async (page, limit, query) => {
  let offset = limit * (page - 1), text, kbb = [], arr = [], kbs, kw

  const selected_feedback = await getFeedbackPagination(query, offset, limit),
    all_feedback = await getAllFeedback(query)

  if (selected_feedback.length > 0) {
    text = `<b>Hozirgi: ${offset + 1}-${selected_feedback.length + offset}, Jami:${all_feedback.length}</b>\n\n`

    for (let i = 0; i < selected_feedback.length; i++) {
      const feedback = selected_feedback[i], author = await getUser({telegram_id: feedback.author})

      const obj = {text: `${i + 1}`, callback_data: JSON.stringify({phrase: 'do_feed', id: feedback._id})}

      arr.push(obj)

      if (arr.length % 6 === 0) {
        kbb.push(arr)
        arr = []
      }

      text += `<b>${i + 1}.</b> ${author.name} - ${feedback.mark}\n`
    }

    kbb.push(arr)

    const inline_keyboard = [
      {
        text: `⬅️`,
        callback_data: JSON.stringify({phrase: page !== 1 ? `left#dofeedback#${page - 1}` : 'none', id: ''})
      },
      {text: `❌`, callback_data: JSON.stringify({phrase: `delete`, id: ''})},
      {
        text: ` ➡️`,
        callback_data: JSON.stringify({
          phrase: selected_feedback.length + offset !== all_feedback.length ? `right#dofeedback#${page + 1}` : 'none',
          id: ''
        })
      }
    ]

    kbb.push(inline_keyboard)

    kw = 'YES'

    kbs = {reply_markup: {inline_keyboard: kbb}}
  } else if (selected_feedback.length <= 0) {
    kw = 'NO'

      text = "Hali bajarilayotgan izohlar mavjud emas"
      kbs = {reply_markup: {resize_keyboard: true, keyboard: keyboard.admin.feedback}}
  }

  return {text, kbs, kw}
}

const date = (day) => {
  const year = day.getFullYear(), month = day.getMonth(), date = day.getDate(), hour = day.getHours(),
    minutes = day.getMinutes()

  return `${year}-${month + 1}-${date}. ${hour}:${minutes}`
}
const date_name = () => {
  let year, month, date

  const day = new Date()

  year = day.getFullYear(), month = day.getMonth(), date = day.getDate()

  if (month === 9) {
    month += 1
  } else if (month < 10 && month !== 9) {
    month = `0${month + 1}`
  }

  return `${date}-${month}-${year}`
}
const date_is_valid = (date) => {
  const day = new Date(date)
  return day instanceof Date && !isNaN(day);
}
const parse_number = (text) => {
  return Number(text).toString()
}

module.exports = {
  report,
  poem_pagination,
  renown_pagination,
  music_pagination,
  felicitation_pagination,
  feedback_seen_pagination,
  feedback_done_pagination,
  date,
  date_name,
  date_is_valid,
  parse_number
}
