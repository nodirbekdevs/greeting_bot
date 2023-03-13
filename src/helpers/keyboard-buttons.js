module.exports = {

  start: '/start',

  language: {
    uz: "🇺🇿 UZ",
    ru: '🇷🇺 RU',
  },

  main: {
    uz: '🏠 Bosh sahifa',
    ru: '🏠 Главная страница',
  },

  admin: {
    pages: {
      settings: "Sozlamalar",
      poems: "Sherlar",
      renowns: "Ismlar",
      felicitations: "Tabriklar",
      musics: "Musiqalar",
      audios: "Tayyor audiolar",
      feedback: "Izohlar",
      advertisements: "Reklama"
    },

    settings: {
      name: "Ismni o'zgartirish",
      number: "Telefon raqamni o'zgartirish",
    },

    poems: {
      all: "Barcha sherlar",
      add: "Sher qo'shish"
    },

    renowns: {
      all: "Barcha ismlar",
      add: "Ism qo'shish"
    },

    felicitations: {
      all: "Barcha tabriklar",
      add: "Tabrik qo'shish"
    },

    musics: {
      all: "Barcha musiqalar",
      add: "Musiqa qo'shish"
    },

    audios: {
      dad: 'OTA',
      mum: 'ONA',
      older_brother: 'AKA',
      older_sister: 'OPA',
      younger_brother: "UKA",
      younger_sister: "SINGIL"
    },

    feedback: {
      read: "O'qilmagan izohlar",
      doing: "Tugallanayotgan izohlar",
      number: "Izohlar soni"
    },

    advertisements: {
      number: "Reklamalar Soni",
      all: "Jo'natilishi keraklilari",
      add: "Reklama qo'shish"
    }
  },

  user: {
    pages: {
      uz: {
        settings: "Sozlamalar",
        felicitations: "Tabriklar",
        feedback: "Izohlar",
      },
      ru: {
        settings: "Настройки",
        felicitations: "Поздравлении",
        feedback: "Комментарии",
      }
    },

    settings: {
      uz: {
        name: "Ismni o'zgartirish",
        number: "Telefon raqamni o'zgartirish",
        lang: "Platformadagi tilni o'zgartirish"
      },
      ru: {
        name: "Изменение имени",
        number: "Изменить номер телефона",
        lang: "Измените язык на платформе"
      }

    },

    felicitations: {
      uz: {
        all: "Mening tabriklarim",
        add: "Yangi tabrik"
      },
      ru: {
        all: "Мои поздравлении",
        add: "Новое поздравление"
      }
    },

    feedback: {
      uz: {
        my_feedback: '📃 Mening izohlarim',
        add: '📝 Izoh qoldirish'
      },
      ru: {
        my_feedback: '📃 Мои коментарии',
        add: '📝 Оставить коментария'
      }
    },
  },

  options: {
    back: {
      uz: '🔙 Orqaga',
      ru: '🔙 Назад',
    },

    types: {
      dad: 'OTA',
      mum: 'ONA',
      older_brother: 'AKA',
      older_sister: 'OPA',
      younger_brother: "UKA",
      younger_sister: "SINGIL"
    },

    confirmation: {
      uz: "Tasdiqlash",
      ru: "Подтверждение"
    },

    not_to_confirmation: {
      uz: "Tasdiqlamaslik",
      ru: "Не подтверждать"
    },

    feedback: {
      uz: {
        good: "Yaxshi 👍",
        bad: "Yomon 👎"
      },

      ru: {
        good: "Отлично 👍",
        bad: "Плохо 👎"
      }
    },

    send_advertise: "Reklamani jo'natish",

    confirmation_advertising: {
      yes: "Reklamani tasdiqlash",
      no: "Reklamani tasdiqlamaslik",
    },

    paths: {
      poem: './../../../uploads/poems',
      renown: './../../../uploads/renowns',
      felicitation: './../../../uploads/felicitations',
      music: './../../../uploads/musics',
      audio: './../../../uploads/finished'
    }
  }
}
