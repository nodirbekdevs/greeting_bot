const kb = require('./keyboard-buttons')
const keyboard = require('./keyboard')
const {getPoems, getPoemPagination, getPoem} = require('./../controllers/poemController')
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
    kbs = {reply_markup: {resize_keyboard: true, keyboard: keyboard.options.types}}
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
  feedback_seen_pagination,
  feedback_done_pagination,
  date,
  date_name,
  date_is_valid,
  parse_number
}
