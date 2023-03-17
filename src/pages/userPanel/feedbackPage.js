const kb = require('../../helpers/keyboard-buttons')
const keyboard = require('../../helpers/keyboard')
const {getAllFeedback, getFeedback, makeFeedback, updateFeedback, deleteFeedback, countAllFeedback} = require('../../controllers/feedbackController')
const {updateUser} = require('../../controllers/userController')
const {report} = require('./../../helpers/utils')

let feedback_id

const ufs0 = async (bot, chat_id, lang) => {
  let message, kbb

  if (lang === kb.language.uz) {
    message = "Izohlar bo'limi"
    kbb = keyboard.user.feedback.uz
  } else if (lang === kb.language.ru) {
    message = "Страница комментарии"
    kbb = keyboard.user.feedback.ru
  }

  await bot.sendMessage(chat_id, message, {reply_markup: {resize_keyboard: true, keyboard: kbb}})
}

const ufs1 = async (bot, chat_id, lang) => {
  let message, kbb

  const new_feedback = await makeFeedback({author: chat_id})

  feedback_id = new_feedback._id

  if (lang === kb.language.uz) {
    message = "Biz haqimizda nima deb o'ylaysiz"
    kbb = keyboard.options.feedback.uz
  } else if (lang === kb.language.ru) {
    message = "Что вы думаете о нас"
    kbb = keyboard.options.feedback.ru
  }

  await bot.sendMessage(chat_id, message, {reply_markup: {resize_keyboard: true, keyboard: kbb}})
}

const ufs2 = async (bot, chat_id, _id, text, lang) => {
  let message, kbb

  await updateFeedback({_id}, {mark: text, step: 1})

  const feedback = await getFeedback({_id})

  if (lang === kb.language.uz) {
    message = `Nega ${feedback.mark} ligini sababini yozing`
    kbb = keyboard.options.back.uz
  } else if (lang === kb.language.ru) {
    message = `Напишите причину, по которой ${feedback.mark}`
    kbb = keyboard.options.back.ru
  }

  await bot.sendMessage(chat_id, message, {reply_markup: {resize_keyboard: true, keyboard: kbb, one_time_keyboard: true}})
}

const ufs3 = async (bot, chat_id, _id, text, lang) => {
  let message, kbb

  await updateFeedback({_id}, {reason: text, step: 2, status: 'active'})

  await updateUser({telegram_id: chat_id}, {$inc: {total_feedback: 1}})

  if (lang === kb.language.uz) {
    message = "Izohingiz muvaffaqiyatli qoldirildi"
    kbb = keyboard.user.feedback.uz
  } else if (lang === kb.language.ru) {
    message = `Ваш комментарий успешно отправлен.`
    kbb = keyboard.user.feedback.ru
  }

  await bot.sendMessage(chat_id, message, {reply_markup: {resize_keyboard: true, keyboard: kbb}})
}

const ufs4 = async (bot, chat_id, lang) => {
  let message = ''

  const
    count = await countAllFeedback({author: chat_id}),
    process = await countAllFeedback({author: chat_id, status: 'process'}),
    active = await countAllFeedback({author: chat_id, status: 'active'}),
    inactive = await countAllFeedback({author: chat_id, status: 'inactive'}),
    seen = await countAllFeedback({author: chat_id, status: 'seen'}),
    done = await countAllFeedback({author: chat_id, status: 'done'})

  if (count > 0) {
    const data = {number: count, process, active, inactive, seen, done}

    message = report(data, 'FEEDBACK_ALL', lang)
  } else if (count <= 0) {
    message = "Hozircha siz fikr qoldirmagansiz"
  }

  await bot.sendMessage(chat_id, message)
}

const ufs5 = async (bot, chat_id, _id, lang) => {
  await deleteFeedback({_id})
  await ufs0(bot, chat_id, lang)
}

const userFeedback = async (bot, chat_id, text, lang) => {
  const feedback = await getFeedback({_id: feedback_id, status: 'process'})
    ? await getFeedback({_id: feedback_id, status: 'process'})
    : (await getAllFeedback({author: chat_id, status: 'process'}))[0]

  try {
    if (text === kb.user.pages.uz.feedback || text === kb.user.pages.ru.feedback) await ufs0(bot, chat_id, lang)
    else if (text === kb.user.feedback.uz.add || text === kb.user.feedback.ru.add) await ufs1(bot, chat_id, lang)
    else if (text === kb.user.feedback.uz.my_feedback || text === kb.user.feedback.ru.my_feedback) await ufs4(bot, chat_id, lang)

    if (feedback) {
      if (text === kb.options.back.uz || text === kb.options.back.ru) {
        await ufs5(bot, feedback.author, feedback._id, lang)
      } else if (text !== kb.options.back.uz || text !== kb.options.back.ru) {
        if (feedback.step === 0) await ufs2(bot, chat_id, feedback._id, text, lang)
        else if (feedback.step === 1) await ufs3(bot, chat_id, feedback._id, text, lang)
      }
    }
  } catch (e) {
    console.log(e)
  }
}

module.exports = {userFeedback, ufs0}
