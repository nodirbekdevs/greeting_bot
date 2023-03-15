const {amp} = require('./mainPage')
const {aas9} = require('./advertisingPage')
const {afs4, afs5, afs6} = require('./feedbackPage')
const {aps0, aps3, aps4, aps5} = require('./poemPage')
const {ars0, ars3, ars4, ars5} = require('./renownPage')
const {afls0, afls3, afls4, afls5} = require('./felicitationPage')
const {ams0, ams3, ams4, ams5} = require('./musicPage')
const {getAdmin} = require('./../../controllers/adminController')


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

      const admin = await getAdmin({telegram_id: chat_id, status: 'active'}), splitted = admin.situation.split('_')

      admin.situation = ''
      admin.step = 0
      await admin.save()

      if (splitted[0] === 'POEM') await aps0(bot, chat_id)
      else if (splitted[0] === 'RENOWN') await ars0(bot, chat_id)
      else if (splitted[0] === 'FELICITATION') await afls0(bot, chat_id)
      else if (splitted[0] === 'MUSIC') await ams0(bot, chat_id)
      else await amp(bot, chat_id)
    }

    if (phrase === "SEND_AD") await aas9(bot, chat_id, id)

    if (riven && riven.length === 3) {
      await afs4(bot, chat_id, message_id, riven)
      await aps3(bot, chat_id, message_id, riven)
      await ars3(bot, chat_id, message_id, riven)
      await afls3(bot, chat_id, message_id, riven)
      await ams3(bot, chat_id, message_id, riven)
    }

    if (phrase === 'se_feed' || phrase === 'do_feed') await afs5(bot, chat_id, message_id, phrase, id)
    if ((phrase === 'seen' || phrase === 'fsb') || (phrase === 'done' || phrase === 'fdb'))
      await afs6(bot, chat_id, message_id, phrase, id)

    if (phrase === 'spoem') await aps4(bot, chat_id, message_id, id)
    if (phrase === 'po_back') await aps5(bot, chat_id, message_id)

    if (phrase === 'srenown') await ars4(bot, chat_id, message_id, id)
    if (phrase === 're_back') await ars5(bot, chat_id, message_id)

    if (phrase === 'sfelicitation') await afls4(bot, chat_id, message_id, id)
    if (phrase === 'fl_back') await afls5(bot, chat_id, message_id)

    if (phrase === 'smusic') await ams4(bot, chat_id, message_id, id)
    if (phrase === 'mu_back') await ams5(bot, chat_id, message_id)


  } catch (e) {
    console.log(e)
  }
}

module.exports = {adminPanelQuery}
