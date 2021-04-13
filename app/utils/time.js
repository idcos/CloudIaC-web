import moment from 'moment';

export const timeUtils = {
  format: (timeStr, format = 'YYYY-MM-DD HH:mm:ss') => timeStr && moment(timeStr).format(format)
};
