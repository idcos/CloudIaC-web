import { call, put, takeLatest } from 'redux-saga/effects';
import { notification } from 'antd';

import { orgsAPI, pjtAPI } from 'services/base';
import { userAPI } from 'services/auth';

function* getOrgs(action) {
  try {
    const res = yield call(orgsAPI.allEnableOrgs, action.payload);
    if (res.code !== 200) {
      throw new Error(res.message);
    }
    yield put({
      type: 'global/set-orgs',
      payload: res.result || {}
    });
    //url中默认存在orgId
    const { pathname } = window.location;
    const url_orgId = pathname.split('/').filter(i => i)[1];
    if (pathname.indexOf('/org') == 0 && url_orgId) {
      yield put({
        type: 'global/set-curOrg',
        payload: {
          orgId: url_orgId
        }
      });
      yield put({
        type: 'global/getProjects',
        payload: {
          orgId: url_orgId
        }
      });
    }
  } catch (err) {
    notification.error({
      message: err.message
    });
  }
}

function* getProjects(action) {
  try {
    const res = yield call(pjtAPI.allEnableProjects, action.payload);
    if (res.code !== 200) {
      throw new Error(res.message);
    }
    yield put({
      type: 'global/set-projects',
      payload: res.result || {}
    });
    //url中默认存在orgId
    const { pathname } = window.location;
    const url_projectId = pathname.split('/').filter(i => i)[3];
    if (pathname.indexOf('/project/') !== -1 && url_projectId) {
      yield put({
        type: 'global/set-curProject',
        payload: {
          projectId: url_projectId
        }
      });
    }
  } catch (err) {
    notification.error({
      message: err.message
    });
  }
}

function* getUserInfo(action) {
  try {
    const res = yield call(userAPI.info);
    if (res.code !== 200) {
      throw new Error(res.message);
    }
    yield put({
      type: 'global/set-userInfo',
      payload: res.result || {}
    });
  } catch (err) {
    notification.error({
      message: err.message
    });
  }
}

function* updateUserInfo({ payload, cb }) {
  try {
    const res = yield call(userAPI.updateSelf, payload);
    if (res.code !== 200) {
      throw new Error(res.message);
    }
    notification.success({
      message: '操作成功'
    });
    yield put({
      type: 'global/set-userInfo',
      payload: res.result || {}
    });
    cb && cb();
  } catch (err) {
    cb && cb(err);
    notification.error({
      message: err.message
    });
  }
}

export default function* testSaga() {
  yield takeLatest('global/getOrgs', getOrgs);
  yield takeLatest('global/getProjects', getProjects);
  yield takeLatest('global/getUserInfo', getUserInfo);
  yield takeLatest('global/updateUserInfo', updateUserInfo);
}
