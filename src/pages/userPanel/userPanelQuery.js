const {ump} = require('./mainPage')
const {uas0, uas5, uas6, uas7} = require('./audioPage')
const {ufs0} = require('./feedbackPage')
const {getUser} = require('./../../controllers/userController')


const userPanelQuery = async (bot, chat_id, query_id, message_id, phrase, id, lang) => {
  try {
    const riven = phrase.split('#')

    if (phrase === 'none') {
      await bot.answerCallbackQuery(query_id, {
        text: "Bu yerda ma'lumotlar yo'q. Siz noto'g'ri betni tanladingiz.", show_alert: true
      })
    }

    if (phrase === 'delete') {
      await bot.deleteMessage(chat_id, message_id)

      const user = await getUser({telegram_id: chat_id, status: 'active'}), situation = user.situation

      user.situation = ''
      await user.save()

      if (situation === 'FEEDBACK') await ufs0(bot, chat_id, lang)
      else if (situation === 'AUDIO') await uas0(bot, chat_id, lang)
      else await ump(bot, chat_id, lang)
    }

    if (riven && riven.length === 3) if (riven[0] === 'left' || riven[0] === 'right') await uas5(bot, chat_id, message_id, riven)

    await uas6(bot, chat_id, message_id, phrase, id, lang)
    await uas7(bot, chat_id, message_id, phrase, id, lang)

  } catch (e) {
    console.log(e)
  }
}

module.exports = {userPanelQuery}
