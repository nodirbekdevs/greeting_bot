const kb = require('./../../helpers/keyboard-buttons')
const keyboard = require('./../../helpers/keyboard')
const {getFeedback, updateFeedback, countAllFeedback} = require('./../../controllers/feedbackController')
const {report, date, feedback_pagination} = require('./../../helpers/utils')
const {getUser} = require('./../../controllers/userController')

const afs0 = async (bot, chat_id) => {
  await bot.sendMessage(chat_id, 'Izohlar sahifasi', {
    reply_markup: {resize_keyboard: true, keyboard: keyboard.admin.feedback, one_time_keyboard: true}
  })
}

const afs1 = async (bot, chat_id) => {
  const number = await countAllFeedback({}), process = await countAllFeedback({status: 'process'}),
    active = await countAllFeedback({status: 'active'}), inactive = await countAllFeedback({status: 'inactive'}),
    seen = await countAllFeedback({status: 'seen'}), done = await countAllFeedback({status: 'done'})

  const data = {number, process, active, inactive, seen, done}

  const message = report(data, 'FEEDBACK_ALL', kb.language.uz)

  await bot.sendMessage(chat_id, message, {
    reply_markup: {resize_keyboard: true, keyboard: keyboard.admin.feedback, one_time_keyboard: true}
  })
}

const afs2 = async (bot, chat_id, type) => {
  let query, message

  if (type === 'ACTIVE') {
    query = {is_read: false, status: 'active'}
    message = "Hozirgacha yozilgan yangi izohlar"
  } else if (type === 'SEEN') {
    query = {is_read: false, status: 'seen'}
    message = "Hozirgacha bajarilayotgan izohlar"
  }

  const report = await feedback_pagination(1, 6, query)

  if (report.kw === 'YES') {
    await bot.sendMessage(chat_id, report.text, report.kbs)

    await bot.sendMessage(chat_id, message)
  } else if (report.kw === 'NO') {
    await bot.sendMessage(chat_id, report.text, report.kbs)
  }
}

const afs3 = async (bot, chat_id, message_id, data) => {
  let query

  if (data[1] === 'selfeedback') query = {is_read: false, status: 'active'}
  if (data[1] === 'dofeedback') query = {is_read: true, status: 'seen'}

  const report = await feedback_pagination(parseInt(data[2]), 6, query), kbb = report.kbs.reply_markup

  await bot.editMessageText(report.text, {chat_id, message_id, parse_mode: 'HTML', reply_markup: kbb})
}

const afs4 = async (bot, chat_id, message_id, data, _id) => {
  let message, info, clause, cqw

  const feedback = await getFeedback({_id}), author = await getUser({telegram_id: feedback.author}),
    created_at = date(feedback.created_at), lang = kb.language.uz

  const data2 = {author: author.name, mark: feedback.mark, reason: feedback.reason, status: feedback.status, created_at}

  if (data === 'se_feed') {
    message = report(data2, 'FEEDBACK', lang)

    if (feedback.status === kb.options.feedback.uz.good || feedback.status === kb.options.feedback.ru.good) {
      clause = "Ko'rildi"
      info = 's_d'
    } else if (feedback.status === kb.options.feedback.uz.bad || feedback.status === kb.options.feedback.ru.bad) {
      clause = "Muommoni ko'rish boshlandi"
      info = 'seen'
    }

    cqw = 'fsb'
  }

  if (data === 'do_feed') {
    message = report(data2, 'FEEDBACK', lang)

    clause = "Muommoni hal qilindi"
    info = "done"
    cqw = "fdb"
  }

  await bot.editMessageText(message, {
    chat_id, message_id, parse_mode: 'HTML',
    reply_markup: {
      inline_keyboard: [
        [{text: clause, callback_data: JSON.stringify({phrase: info, id: feedback._id})}],
        [{text: kb.options.back.uz, callback_data: JSON.stringify({phrase: cqw, id: ''})}],
      ]
    }
  })
}

const afs5 = async (bot, chat_id, message_id, data, _id) => {
  let message, information, clause, query

  const feedback = await getFeedback({_id}), author = await getUser({telegram_id: feedback.author})

  const data2 = {name: author.name, feedback: feedback.reason}

  if (data === 'seen' || data === 's_d' || data === 'fsb') {
    if (data === 'seen') {
      if (feedback.status === 'active') {
        await updateFeedback({_id: feedback._id}, {is_read: true, status: 'seen'})
        message = report(data2, 'FEEDBACK_SEEN', author.lang)
      }

      clause = "Bu izoh ustida ishlar boshlandi"
    }

    if (data === 's_d') {
      if (feedback.status === 'active') {
        await updateFeedback({_id: feedback._id}, {status: 'done'})
        message = report(data2, 'FEEDBACK_DONE', author.lang)
      }

      clause = "Muommo ko'rildi"
    }

    query = {is_read: false, status: 'active'}
  }

  if (data === 'done' || data === 'fdb') {
    if (data === 'done') {
      if (feedback.status === 'seen') {
        await updateFeedback({_id: feedback._id}, {status: 'done'})
        message = report(data2, 'FEEDBACK_DONE', author.lang)
      }

      clause = "Muommoni hal qilindi"
    }
    query = {is_read: true, status: 'seen'}
  }

  await bot.sendMessage(feedback.author, message)

  await bot.sendMessage(chat_id, clause)

  information = await feedback_pagination(1, 6, query)

  if (information.kw === 'YES') {
    await bot.editMessageText(information.text, {
      chat_id, message_id, parse_mode: 'HTML', reply_markup: information.kbs.reply_markup
    })
  } else if (information.kw === 'NO') {
    await bot.deleteMessage(chat_id, message_id)

    await bot.sendMessage(chat_id, information.text, information.kbs)
  }
}

const adminFeedback = async (bot, chat_id, text) => {
  try {
    if (text === kb.admin.pages.feedback) await afs0(bot, chat_id)
    if (text === kb.admin.feedback.number) await afs1(bot, chat_id)
    if (text === kb.admin.feedback.read) await afs2(bot, chat_id, 'ACTIVE')
    if (text === kb.admin.feedback.doing) await afs2(bot, chat_id, 'SEEN')
  } catch (e) {
    console.log(e)
  }
}

module.exports = {adminFeedback, afs3, afs4, afs5}
