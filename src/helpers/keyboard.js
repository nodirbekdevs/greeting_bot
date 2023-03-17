const kb = require('./keyboard-buttons')

module.exports = {
  language: [
    [kb.language.uz, kb.language.ru]
  ],

  main: {
    uz: [[kb.main.uz]],
    ru: [[kb.main.ru]]
  },

  start: [[kb.start]],

  admin: {
    pages: [
      [kb.admin.pages.settings],
      [kb.admin.pages.advertisements, kb.admin.pages.feedback],
      [kb.admin.pages.poems, kb.admin.pages.renowns],
      [kb.admin.pages.felicitations, kb.admin.pages.musics, kb.admin.pages.audios]
    ],

    settings: [
      [kb.admin.settings.name, kb.admin.settings.number],
      [kb.main.uz]
    ],

    poems: [
      [kb.admin.poems.all, kb.admin.poems.add],
      [kb.main.uz]
    ],

    renown: [
      [kb.admin.renowns.all, kb.admin.renowns.add],
      [kb.main.uz]
    ],

    felicitations: [
      [kb.admin.felicitations.all, kb.admin.felicitations.add],
      [kb.main.uz]
    ],

    musics: [
      [kb.admin.musics.all, kb.admin.musics.add],
      [kb.main.uz]
    ],

    audios: [
      [kb.admin.audios.dad, kb.admin.audios.mum],
      [kb.admin.audios.older_brother, kb.admin.audios.older_sister],
      [kb.admin.audios.younger_brother, kb.admin.audios.younger_sister],
      [kb.main.uz]
    ],

    feedback: [
      [kb.admin.feedback.number],
      [kb.admin.feedback.read, kb.admin.feedback.doing],
      [kb.main.uz]
    ],

    advertisements: [
      [kb.admin.advertisements.add],
      [kb.admin.advertisements.all, kb.admin.advertisements.number],
      [kb.main.uz]
    ],
  },

  user: {
    pages: {
      uz: [
        [kb.user.pages.uz.settings, kb.user.pages.uz.feedback],
        [kb.user.pages.uz.felicitations]
      ],
      ru: [
        [kb.user.pages.ru.settings, kb.user.pages.ru.feedback],
        [kb.user.pages.ru.felicitations]
      ]
    },

    settings: {
      uz: [
        [kb.user.settings.uz.name],
        [kb.user.settings.uz.number, kb.user.settings.uz.lang],
        [kb.main.uz]
      ],
      ru: [
        [kb.user.settings.ru.name],
        [kb.user.settings.ru.number, kb.user.settings.ru.lang],
        [kb.main.ru]
      ]
    },

    feedback: {
      uz: [
        [kb.user.feedback.uz.add, kb.user.feedback.uz.my_feedback],
        [kb.main.uz]
      ],
      ru: [
        [kb.user.feedback.ru.add, kb.user.feedback.ru.my_feedback],
        [kb.main.ru]
      ]
    },

    felicitations: {
      uz: [
        [kb.user.felicitations.uz.all, kb.user.felicitations.uz.add],
        [kb.main.uz]
      ],
      ru: [
        [kb.user.felicitations.ru.all, kb.user.felicitations.ru.add],
        [kb.main.ru]
      ]
    }
  },

  options: {
    confirmation: {
      uz: [[kb.options.confirmation.uz, kb.options.not_to_confirmation.uz]],
      ru: [[kb.options.confirmation.ru, kb.options.not_to_confirmation.ru]]
    },

    types_relations: [
      [kb.options.types_relations.dad, kb.options.types_relations.mum],
      [kb.options.types_relations.older_brother, kb.options.types_relations.older_sister],
      [kb.options.types_relations.younger_brother, kb.options.types_relations.younger_brother],
      [kb.options.back.uz]
    ],

    types_gender: [
      [kb.options.types_gender.male, kb.options.types_gender.female],
      [kb.options.back.uz]
    ],

    feedback: {
      uz: [
        [kb.options.feedback.uz.good, kb.options.feedback.uz.bad],
        [kb.options.back.uz]
      ],

      ru: [
        [kb.options.feedback.ru.good, kb.options.feedback.ru.bad],
        [kb.options.back.ru]
      ]
    },

    back: {
      uz: [[kb.options.back.uz]],
      ru: [[kb.options.back.ru]],
    },

    confirmation_advertising: [
      [kb.options.confirmation_advertising.yes, kb.options.confirmation_advertising.no]
    ],
  }
}
