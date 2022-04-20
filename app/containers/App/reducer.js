import { handleActions } from 'redux-actions';
import { fromJS } from 'immutable';
import { safeJsonStringify, safeJsonParse } from 'utils/util';

const initialState = fromJS({
  orgs: {},
  curOrg: null,
  projects: {},
  curProject: safeJsonParse([localStorage.getItem('curProject')]),
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
    return state.set('curOrg', orgs.find(it => it.id == payload.orgId));
  },
  'global/set-projects': (state, { payload }) => {
    return state.set('projects', fromJS(payload));
  },
  'global/set-curProject': (state, { payload }) => {
    const { projectId } = payload;
    const projects = state.toJS().projects.list || [];
    const curProject = projects.find(it => projectId && it.id == projectId) || null;
    localStorage.setItem('curProject', safeJsonStringify([curProject]));
    return state.set('curProject', curProject);
  },
  'global/set-userInfo': (state, { payload }) => {
    return state.set('userInfo', fromJS(payload));
  }
},
initialState
);

export default reducer;
