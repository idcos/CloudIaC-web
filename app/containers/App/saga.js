import { call, put, takeLatest } from 'redux-saga/effects';
import { notification } from 'antd';

import { orgsAPI } from 'services/base';

function* getOrgs(action) {
  try {
    const res = yield call(orgsAPI.list, action.payload);
    if (!res.isSuccess) {
      throw new Error(res.message);
    }
    yield put({
      type: 'global/set-orgs',
      payload: res.resultObject || []
    });
  } catch (err) {
    notification.error({
      message: err.message
    });
  }
}

export default function* testSaga() {
  yield takeLatest('global/getOrgs', getOrgs);
}
