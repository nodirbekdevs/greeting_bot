const {adminMainPage} = require('./mainPage')
const {adminSettings} = require('./settingsPage')
const {adminAdvertising} = require('./advertisingPage')
const {adminFeedback} = require('./feedbackPage')
const {adminPoems} = require('./poemPage')
const {adminRenowns} = require('./renownPage')
const {adminFelicitations} = require('./felicitationPage')
const {adminMusics} = require('./musicPage')
const {getAdmin, updateAdmin} = require('./../../controllers/adminController')
const {adminPanelQuery} = require('./adminPanelQuery')

const adminPanel = async (bot, message, admin) => {
  let text

  const chat_id = message.chat.id, username = message.from.username

  if (message.text) {
    text = message.text
  } else if (message.photo) {
    text = message.photo[0].file_id
  } else if (message.audio) {
    text = message.audio.file_id
  }

  if (admin.username !== username) await updateAdmin({_id: admin._id}, {username})

  try {
    await adminMainPage(bot, chat_id, text)
    await adminSettings(bot, admin, text)
    await adminPoems(bot, chat_id, text)
    await adminRenowns(bot, chat_id, text)
    await adminFelicitations(bot, chat_id, text)
    await adminMusics(bot, chat_id, text)
    await adminFeedback(bot, chat_id, text)
    await adminAdvertising(bot, chat_id, text)
  } catch (e) {
    console.log(e)
  }
}

module.exports = {adminPanel, adminPanelQuery, getAdmin}
