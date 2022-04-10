const { getLanguage } = require('utils/i18n');

exports.DEFAULT_LOCALE = getLanguage();

exports.appLocales = [
  'zh',
  'en'
];
