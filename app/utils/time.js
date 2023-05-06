import moment from 'moment';
import { t } from 'utils/i18n';

export const timeUtils = {
  format: (timeStr, format = 'YYYY-MM-DD HH:mm:ss') =>
    timeStr && moment(timeStr).format(format),
  diff: (timeStr, diffValue, defaultValue = '') => {
    if (!timeStr) {
      return defaultValue;
    }
    const du = moment.duration(moment(timeStr).diff(diffValue), 'ms');
    if (du.valueOf() < 0) {
      return defaultValue;
    }
    const { years, months, days, hours, minutes, seconds } = du._data;
    let text = '';
    if (years > 0 || text) {
      text += `${years}${t('define.time.years')}`;
    }
    if (months > 0 || text) {
      text += `${months}${t('define.time.months')}`;
    }
    if (days > 0 || text) {
      text += `${days}${t('define.time.days')}`;
    }
    if (hours > 0 || text) {
      text += `${hours}${t('define.time.hours')}`;
    }
    if (minutes > 0 || text) {
      text += `${minutes}${t('define.time.minutes')}`;
    }
    text += `${seconds}${t('define.time.seconds')}`;
    return text;
  },
};
