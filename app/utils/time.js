import moment from 'moment';
import { t } from 'utils/i18n';

export const timeUtils = {
  format: (timeStr, format = 'YYYY-MM-DD HH:mm:ss') => timeStr && moment(timeStr).format(format),
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
      text += `${years}${t('$static.time.years')}`; 
    }
    if (months > 0 || text) {
      text += `${months}${t('$static.time.months')}`; 
    }
    if (days > 0 || text) {
      text += `${days}${t('$static.time.days')}`; 
    }
    if (hours > 0 || text) {
      text += `${hours}${t('$static.time.hours')}`; 
    }
    if (minutes > 0 || text) {
      text += `${minutes}${t('$static.time.minutes')}`; 
    }
    text += `${seconds}${t('$static.time.seconds')}`; 
    return text;
  }
};


