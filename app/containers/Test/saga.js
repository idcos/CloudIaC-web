import { call, put, takeLatest } from 'redux-saga/effects';

const mockData = [
  {
    name: '1',
    age: 11
  },
  {
    name: '2',
    age: 22
  }
];

function* getList() {
  try {
    yield put({
      type: 'test/set/names',
      payload: mockData
    });
  } catch (err) {
    console.log(err);
  }
}

export default function* testSaga() {
  yield takeLatest('test/getList', getList);
}
