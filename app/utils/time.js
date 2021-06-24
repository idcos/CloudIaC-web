import moment from 'moment';

export const timeUtils = {
  format: (timeStr, format = 'YYYY-MM-DD HH:mm:ss') => timeStr && moment(timeStr).format(format),
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


