import isNumber from 'lodash/isNumber';
import isString from 'lodash/isString';

export const getEditableIdByIndex = index => {
  if (isNumber(index)) {
    return `editable_${index}`;
  }

  return index;
};

export const getIndexByEditableId = id => {
  return isString(id) && id.indexOf('editable_') === 0 ? +id.slice(9) : id;
};
