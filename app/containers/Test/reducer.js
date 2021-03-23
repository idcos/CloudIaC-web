import produce from 'immer';

export const initialState = {
  names: []
};

/* eslint-disable default-case, no-param-reassign */
const testReducer = (state = initialState, action) =>
  produce(state, draft => {
    switch (action.type) {
      case 'test/set/names':
        draft.names = action.payload;
        break;
    }
  });

export default testReducer;
