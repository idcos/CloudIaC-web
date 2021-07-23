import { handleActions } from 'redux-actions';

import { fromJS } from 'immutable';

const initialState = fromJS({
  orgs: {},
  curOrg: null,
  projects: {},
  curProject: null,
  userInfo: {},
  curEnv: null
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
    return state.set('curOrg', orgs.find(it => it.id == payload.orgId));
  },
  'global/set-projects': (state, { payload }) => {
    return state.set('projects', fromJS(payload));
  },
  'global/set-curProject': (state, { payload }) => {
    if (!payload.projectId) {
      return state.set('curProject', null);
    }
    const projects = state.toJS().projects.list;
    return state.set('curProject', projects.find(it => it.id == payload.projectId));
  },
  'global/set-curEnv': (state, { payload }) => {
    return state.set('curEnv', payload.state);
  },
  'global/set-userInfo': (state, { payload }) => {
    return state.set('userInfo', fromJS(payload));
  }
},
initialState
);

export default reducer;
