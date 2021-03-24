import { handleActions } from 'redux-actions';

import { fromJS } from 'immutable';

const initialState = fromJS({
  orgs: []
});

const reducer = handleActions({
  'global/set-orgs': (state, { payload }) => {
    return state.set('orgs', fromJS(payload));
  }
},
initialState
);

export default reducer;
