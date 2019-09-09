import { call, put, select, takeLatest } from 'redux-saga/effects';
import { MAKE_LOGIN, MAKE_TIME_IN, MAKE_TIME_OUT } from './types';
import { setLogin } from './actions';
import request from 'utils/request';

export function* makeLogin(action) {
  const { email, password } = action;
  const url = 'http://localhost:5000/users/login';
  const options = {
    email,
    password
  };
  const auth = yield call(request, url, options);
  yield put(setLogin(auth.data.token, auth.data.user));
}

export function* makeTimeIn(action) {
  const { email, password } = action;
  const url = 'http://localhost:5000/record/timein';
  const options = {
    email,
    password
  };
  const response = yield call(request, url, options);
  console.log(response);
  alert(`Hello ${email}, you successfully time in`);
}

export function* makeTimeOut(action) {
  const { email, password } = action;
  const url = 'http://localhost:5000/record/timeout';
  const options = {
    email,
    password
  };
  const response = yield call(request, url, options);
  console.log(response);
  alert(`Hello ${email}, you successfully time out`);
}

export default function* loginSaga() {
  yield takeLatest(MAKE_LOGIN, makeLogin);
  yield takeLatest(MAKE_TIME_IN, makeTimeIn);
  yield takeLatest(MAKE_TIME_OUT, makeTimeOut);
}