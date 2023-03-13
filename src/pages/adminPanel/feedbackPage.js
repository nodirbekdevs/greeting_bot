const kb = require('./../../helpers/keyboard-buttons')
const keyboard = require('./../../helpers/keyboard')
const {getFeedback, updateFeedback, countAllFeedback} = require('./../../controllers/feedbackController')
const {report, date, feedback_seen_pagination, feedback_done_pagination} = require('./../../helpers/utils')
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

const afs2 = async (bot, chat_id) => {
  const query = {is_read: false, status: 'active'}

  const report = await feedback_seen_pagination(1, 6, query)

  if (report.kw === 'YES') {
    await bot.sendMessage(chat_id, report.text, {parse_mode: 'HTML', reply_markup: report.kbs.reply_markup})

    await bot.sendMessage(chat_id, "Hozirgacha yozilgan yangi izohlar")
  } else if (report.kw === 'NO') {
    await bot.sendMessage(chat_id, report.text, report.kbs)
  }
}

const afs3 = async (bot, chat_id) => {
  const query = {is_read: true, status: 'seen'}

  const report = await feedback_done_pagination(1, 6, query)

  if (report.kw === 'YES') {
    await bot.sendMessage(chat_id, report.text, {parse_mode: 'HTML', reply_markup: report.kbs.reply_markup})

    await bot.sendMessage(chat_id, "Hozirgacha bajarilayotgan izohlar")
  } else if (report.kw === 'NO') {
    await bot.sendMessage(chat_id, report.text, report.kbs)
  }
}

const afs4 = async (bot, chat_id, message_id, data) => {
  let query, report, kbb

  if ((data[0] === 'left' || data[0] === 'right') && data[1] === 'selfeedback') {
    query = {is_read: false, status: 'active'}

    report = await feedback_seen_pagination(parseInt(data[2]), 6, query)
  }

  if ((data[0] === 'left' || data[0] === 'right') && data[1] === 'dofeedback') {
    query = {is_read: true, status: 'seen'}

    report = await feedback_done_pagination(parseInt(data[2]), 6, query)
  }

  if (report) {
    kbb = report.kbs.reply_markup

    await bot.editMessageText(report.text, {chat_id, message_id, parse_mode: 'HTML', reply_markup: kbb})
  }
}

const afs5 = async (bot, chat_id, query_id, message_id, data, _id) => {
  let message

  const lang = kb.language.uz

  if (data === 'se_feed') {
    const feedback = await getFeedback({_id}), author = await getUser({telegram_id: feedback.author}),
      created_at = date(feedback.created_at)

    const data = {
      author: author.name,
      branch: feedback.branch,
      mark: feedback.mark,
      reason: feedback.reason,
      status: feedback.status,
      created_at
    }

    message = report(data, 'FEEDBACK', lang)

    await bot.editMessageText(message, {
      chat_id, message_id, parse_mode: 'HTML',
      reply_markup: {
        inline_keyboard: [
          [{text: "Muommoni ko'rish boshlandi", callback_data: JSON.stringify({phrase: "seen", id: feedback._id})}],
          [{text: kb.options.back.uz, callback_data: JSON.stringify({phrase: "fsb", id: ''})}],
        ]
      }
    })
  }

  if (data === 'do_feed') {
    const feedback = await getFeedback({_id}), author = await getUser({telegram_id: feedback.author}),
      created_at = date(feedback.created_at)

    const data = {
      author: author.name,
      mark: feedback.mark,
      reason: feedback.reason,
      status: feedback.status,
      created_at
    }

    message = report(data, 'FEEDBACK', lang)

    await bot.editMessageText(message, {
      chat_id, message_id, parse_mode: 'HTML',
      reply_markup: {
        inline_keyboard: [
          [{text: "Muommoni hal qilindi", callback_data: JSON.stringify({phrase: "done", id: feedback._id})}],
          [{text: kb.options.back.uz, callback_data: JSON.stringify({phrase: "fdb", id: ''})}],
        ]
      }
    })
  }
}

const afs6 = async (bot, chat_id, query_id, message_id, data, _id) => {
  let message, information

  if (data === 'seen' || data === 'fsb') {
    if (data === 'seen') {
      const feedback = await getFeedback({_id}), author = await getUser({telegram_id: feedback.author})

      const data2 = {name: author.name, feedback: feedback.reason}

      if (feedback.status === 'active') {
        await updateFeedback({_id: feedback._id}, {is_read: true, status: 'seen'})
        message = report(data2, 'FEEDBACK_SEEN', author.lang)
      }

      await bot.sendMessage(feedback.author, message)

      await bot.sendMessage(chat_id, "Bu izoh ustida ishlar boshlandi")
    }

    const query = {is_read: false, status: 'active'}

    information = await feedback_seen_pagination(1, 6, query)
  }
  if (data === 'done' || data === 'fdb') {
    if (data === 'done') {
      const feedback = await getFeedback({_id})

      const author = await getUser({telegram_id: feedback.author})

      const data2 = {name: author.name, feedback: feedback.reason}

      if (feedback.status === 'seen') {
        await updateFeedback({_id: feedback._id}, {status: 'done'})
        message = report(data2, 'FEEDBACK_DONE', author.lang)
      }

      await bot.sendMessage(feedback.author, message)

      await bot.sendMessage(chat_id, "Muommoni hal qilindi")
    }

    const query = {is_read: true, status: 'seen'}

    information = await feedback_done_pagination(1, 6, query)
  }

  if (information.kw === 'YES') {
    await bot.editMessageText(information.text, {
      chat_id, message_id, parse_mode: 'HTML', reply_markup: information.kbs.reply_markup
    })
  } else if (information.kw === 'NO') {
    await bot.deleteMessage(chat_id, message_id)

    await bot.sendMessage(chat_id, information.text, {reply_markup: information.kbs.reply_markup})
  }
}

const ownerFeedback = async (bot, chat_id, text) => {
  try {
    if (text === kb.admin.pages.feedback) await afs0(bot, chat_id)
    if (text === kb.admin.feedback.number) await afs1(bot, chat_id)
    if (text === kb.admin.feedback.read) await afs2(bot, chat_id)
    if (text === kb.admin.feedback.doing) await afs3(bot, chat_id)
  } catch (e) {
    console.log(e)
  }
}

module.exports = {ownerFeedback, afs4, afs5, afs6}
