import { handleActions } from 'redux-actions';

import { fromJS } from 'immutable';

const initialState = fromJS({
  orgs: {},
  curOrg: null,
  userInfo: {}
});

const reducer = handleActions({
  'global/set-orgs': (state, { payload }) => {
    return state.set('orgs', fromJS(payload));
  },
  'global/set-curOrg': (state, { payload }) => {
    if (!payload.orgId) {
      return state.set('curOrg', null);
    }
    const orgs = state.toJS().orgs.list;
    return state.set('curOrg', orgs.find(it => it.guid == payload.orgId));
  },
  'global/set-userInfo': (state, { payload }) => {
    return state.set('userInfo', fromJS(payload));
  }
},
initialState
);

export default reducer;
