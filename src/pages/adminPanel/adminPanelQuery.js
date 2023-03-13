const {amp} = require('./mainPage')
const {aas9} = require('./advertisingPage')
const {afs4, afs5, afs6} = require('./feedbackPage')
const {aps3, aps4, aps5} = require('./poemPage')

const adminPanelQuery = async (bot, chat_id, query_id, message_id, phrase, id) => {
  try {
    const riven = phrase.split('#')

    if (phrase === 'none') {
      await bot.answerCallbackQuery(query_id, {
        text: "Bu yerda ma'lumotlar yo'q. Siz noto'g'ri betni tanladingiz.", show_alert: true
      })
    }

    if (phrase === 'delete') {
      await bot.deleteMessage(chat_id, message_id)

      await amp(bot, chat_id)
    }

    if (phrase === "SEND_AD") await aas9(bot, chat_id, id)

    if (riven && riven.length === 3) {
      await afs4(bot, chat_id, message_id, riven)
      await aps3(bot, chat_id, message_id, riven)
    }

    if (phrase === 'se_feed' || phrase === 'do_feed') await afs5(bot, chat_id, query_id, message_id, phrase, id)
    if ((phrase === 'seen' || phrase === 'fsb') || (phrase === 'done' || phrase === 'fdb'))
      await afs6(bot, chat_id, query_id, message_id, phrase, id)

    if (phrase === 'spoem') await aps4(bot, chat_id, message_id, id)
    if (phrase === 'po_back') await aps5(bot, chat_id, message_id)


  } catch (e) {
    console.log(e)
  }
}

module.exports = {adminPanelQuery}
