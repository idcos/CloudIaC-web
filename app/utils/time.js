import moment from 'moment';

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
      text += `${years}年`; 
    }
    if (months > 0 || text) {
      text += `${months}月`; 
    }
    if (days > 0 || text) {
      text += `${days}天`; 
    }
    if (hours > 0 || text) {
      text += `${hours}时`; 
    }
    if (minutes > 0 || text) {
      text += `${minutes}分`; 
    }
    if (seconds > 0 || text) {
      text += `${seconds}秒`; 
    }
    return text;
  },
  humanize: (seconds) => {
    seconds = seconds || 0;
    const oneDay = 3600 * 24;
    const oneHour = 3600;
    const oneMin = 60;
    if (seconds < oneMin) {
      return '< 1分钟';
    } else if (seconds < oneHour) {
      const mins = Math.round(seconds / oneMin);
      return mins + '分钟';
    } else if (seconds <= oneDay) {
      const hours = Math.round(seconds / oneHour);
      return hours + '小时';
    } else {
      return '> 1天';
    }
  } 
};


