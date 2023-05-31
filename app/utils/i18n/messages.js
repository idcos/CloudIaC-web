import { defineMessages } from 'react-intl';
import mapValues from 'lodash/mapValues';
import zhJson from 'translations/zh.json';

const messageProps = mapValues(zhJson, (value, key) => {
  return {
    id: key,
    defaultMessage: value,
  };
});

export default defineMessages(messageProps);
