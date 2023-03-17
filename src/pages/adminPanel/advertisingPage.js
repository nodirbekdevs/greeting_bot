const kb = require('./../../helpers/keyboard-buttons')
const keyboard = require('./../../helpers/keyboard')
const {getAdvertisements, getAdvertising, makeAdvertising, updateAdvertising, deleteAdvertising, countAdvertisements} = require('./../../controllers/advertisingController')
const {updateAdmin} = require('./../../controllers/adminController')
const {getUsers} = require('./../../controllers/userController')
const {report} = require('./../../helpers/utils')

let advertising_id

const aas0 = async (bot, chat_id) => {
  await bot.sendMessage(chat_id, "Rekmala bo'limi", {
    reply_markup: {resize_keyboard: true, keyboard: keyboard.admin.advertisements}
  })
}

const aas1 = async (bot, chat_id) => {
  let message = ''

  const number = await countAdvertisements({}), active = await countAdvertisements({status: 'active'}),
    inactive = await countAdvertisements({status: 'inactive'}),
    approved = await countAdvertisements({status: 'approved'})

  message += `Umumiy reklamalar soni - ${number}\n`
  message += `Tugallangan reklamalar soni - ${active}\n`
  message += `Xato reklamalar soni - ${inactive}\n`
  message += `Tasdiqlangan reklamalar soni - ${approved}`

  await bot.sendMessage(chat_id, message)
}

const aas2 = async (bot, chat_id) => {
  const advertisements = await getAdvertisements({status: 'active'}),
    count = await countAdvertisements({status: 'active'})

  for (let i = 0; i < advertisements.length; i++) {
    let rm

    const advertising = advertisements[i], message = report(advertising, 'ADVERTISING', kb.language.uz)

    if (!advertising.is_send && advertising.status === 'approved') {
      rm = {reply_markup: {}}
    } else {
      rm = {
        reply_markup: {
          inline_keyboard: [[{
            text: kb.options.send_advertise, callback_data: JSON.stringify({phrase: 'SEND_AD', id: advertising._id})
          }]]
        }
      }
    }

    await bot.sendPhoto(chat_id, advertising.image, {
      caption: message, parse_mode: 'HTML', reply_markup: rm.reply_markup
    })
  }

  await bot.sendMessage(chat_id, `Barcha reklamalar - ${count}`)
}

const aas3 = async (bot, chat_id) => {
  const new_advertising = await makeAdvertising(chat_id)
  advertising_id = new_advertising._id

  await bot.sendMessage(chat_id, "Reklama joylashga hush kelibsiz")
  await bot.sendMessage(chat_id, "Reklamani rasmini jo'nating", {
    reply_markup: {resize_keyboard: true, keyboard: keyboard.options.back.uz}
  })
}

const aas4 = async (bot, chat_id, _id, text) => {
  await updateAdvertising({_id}, {image: text, step: 1})

  await bot.sendMessage(chat_id, "Reklamaning sarlavhasini kiriting", {
    reply_markup: {resize_keyboard: true, keyboard: keyboard.options.back.uz}
  })
}

const aas5 = async (bot, chat_id, _id, text) => {
  await updateAdvertising({_id}, {title: text, step: 2})

  await bot.sendMessage(chat_id, "Reklama tavsifini kiriting", {
    reply_markup: {resize_keyboard: true, keyboard: keyboard.options.back.uz}
  })
}

const aas6 = async (bot, chat_id, advertising, text) => {
  await updateAdvertising({_id: advertising._id}, {description: text, step: 3})

  const exist_advertising = await getAdvertising({_id: advertising})

  let message = report(exist_advertising, 'ADVERTISING', '')
  message += `\nTugatilganini tasdiqlaysizmi ?`

  await bot.sendPhoto(chat_id, advertising.image, {
    caption: message, parse_mode: 'HTML',
    reply_markup: {resize_keyboard: true, keyboard: keyboard.options.confirmation_advertising}
  })
}

const aas7 = async (bot, chat_id, advertising, text) => {
  let message

  if (text === kb.options.confirmation_advertising.yes) {
    message = "Reklama muvaffaqiyatli yakunlandi"

    await updateAdvertising({_id: advertising._id}, {step: 4, status: 'active'})

    const clause = report(advertising, 'ADVERTISING', '')

    await bot.sendPhoto(chat_id, advertising.image, {
      caption: clause,
      parse_mode: 'HTML',
      reply_markup: {
        resize_keyboard: true,
        inline_keyboard: [[{
          text: kb.options.send_advertise, callback_data: JSON.stringify({phrase: 'SEND_AD', id: advertising._id})
        }]]
      }
    })
  }
  if (text === kb.options.confirmation_advertising.no) {
    await deleteAdvertising({_id: advertising._id})
    message = "Reklama muvaffaqiyatli yakunlanmadi"
  }

  await bot.sendMessage(chat_id, message, {
    reply_markup: {resize_keyboard: true, keyboard: keyboard.admin.advertisements}
  })
}

const aas8 = async (bot, chat_id, _id) => {
  await deleteAdvertising({_id})
  await aas0(bot, chat_id)
}

const aas9 = async (bot, chat_id, _id) => {
  let clause

  const advertising = await getAdvertising({_id}), admin = await getAdmin({telegram_id: advertising.author}),
    users = await getUsers({status: 'active'})

  if (!advertising.is_send) {
    for (let i = 0; i < users.length; i++) {
      const user = users[i], message = report(advertising, 'ADVERTISING', '')

      await bot.sendPhoto(user.telegram_id, advertising.image, {caption: message, parse_mode: 'HTML'})
    }

    await updateAdvertising({_id: advertising._id}, {is_send: true, step: 5, status: 'approved'})

    await updateAdvertising({telegram_id: advertising.author}, {$inc: {total_advertisements: 1}})

    clause = 'Reklama barchaga yuborildi'
  } else {
    clause = "Siz bu reklamani taqdim etib bo'lgansiz"
  }

  await bot.sendMessage(chat_id, clause)
}


const adminAdvertising = async (bot, chat_id, text) => {
  const advertising = await getAdvertising({_id: advertising_id, status: 'process'})
    ? await getAdvertising({_id: advertising_id, status: 'process'})
    : (await getAdvertisements({author: chat_id, status: 'process'}))[0]

  if (text === kb.admin.pages.advertisements) await aas0(bot, chat_id)
  if (text === kb.admin.advertisements.number) await aas1(bot, chat_id)
  if (text === kb.admin.advertisements.all) await aas2(bot, chat_id)
  if (text === kb.admin.advertisements.add) await aas3(bot, chat_id)

  if (advertising) {
    if (text === kb.options.back.uz) {
      await aas8(bot, chat_id, advertising._id)
    } else if (text !== kb.options.back.uz) {
      if (advertising.step === 0) await aas4(bot, chat_id, advertising._id, text)
      if (advertising.step === 1) await aas5(bot, chat_id, advertising._id, text)
      if (advertising.step === 2) await aas6(bot, chat_id, advertising, text)
      if (advertising.step === 3) await aas7(bot, chat_id, advertising, text)
    }
  }
}

module.exports = {adminAdvertising, aas9}
