import { call, put, select, takeLatest } from 'redux-saga/effects';
import request, { getRequest } from 'utils/request';
import { push } from 'react-router-redux';
import {
  MAKE_LOGIN,
  MAKE_TIME_IN,
  MAKE_TIME_OUT,
  MAKE_TODAY_LOGS,
  MAKE_LOGOUT,
  MAKE_GET_DESCRIPTORS,
  MAKE_REGISTER_USER
} from './types';
import {
  setLogin,
  setDialog,
  setRecords,
  setUser,
  setRecord,
  setLoading,
  setDescriptors,
} from './actions';

export function* makeLogin(action) {
  yield put(setLoading(true));
  const { email, password } = action;
  const url = 'http://localhost:5000/users/login';
  const options = {
    email,
    password,
  };
  const auth = yield call(request, url, options);

  sessionStorage.setItem('token', auth.data.token);
  sessionStorage.setItem('userId', auth.data.user.id);
  yield put(setLogin(auth.data.token, auth.data.user));
  yield put(setLoading(false));
  yield put(push('/home'));
}

export function* makeTimeIn(action) {
  yield put(setLoading(true));
  const { email, password, time, remarks, customDate } = action.payload;
  const url = 'http://localhost:5000/record/timein';
  const options = {
    email,
    password,
    time,
    remarks,
    customDate,
  };
  const response = yield call(request, url, options);
  yield put(setLoading(false));
  yield put(setRecords(response.data.records));
  yield put(setRecord(response.data.currentRecord));
  yield put(setUser(response.data.callingUser));
  yield put(setDialog(true));
  // alert(`Hello ${email}, you successfully time in`);
}

export function* makeTimeOut(action) {
  yield put(setLoading(true));
  const { email, password, time, remarks, customDate } = action.payload;
  const url = 'http://localhost:5000/record/timeout';
  const options = {
    email,
    password,
    time,
    remarks,
    customDate,
  };
  const response = yield call(request, url, options);

  yield put(setLoading(false));
  yield put(setRecords(response.data.records));
  yield put(setRecord(response.data.currentRecord));
  yield put(setUser(response.data.callingUser));
  yield put(setDialog(true));
  // alert(`Hello ${email}, you successfully time out`);
}

export function* makeTodayLogs(action) {
  yield put(setLoading(true));
  const { email, password } = action;
  const url = 'http://localhost:5000/record/today_logs';
  const options = {
    email,
    password,
  };
  const response = yield call(request, url, options);

  yield put(setLoading(false));
  yield put(setRecords(response.data.records));
  yield put(setRecord(response.data.currentRecord));
  yield put(setUser(response.data.callingUser));
  yield put(setDialog(true));
  // alert(`Hello ${email}, you successfully time in`);
}

export function* makeLogout() {
  sessionStorage.removeItem('token');
  sessionStorage.removeItem('userId');
  yield put(push('/'));
}

export function* makeGetDescriptors() {
  const url = 'http://localhost:5000/descriptors';
  const response = yield call(getRequest, url);
  if (response.status === 200) {
    yield put(setDescriptors(response.data));
  } else {
    console.log('error');
  }
}

export function* makeRegisterUser(action) {
  const { registration, newProfile } = action;
  const url = 'http://localhost:5000/users';
  const options = {
    ...registration,
  };
  const response = yield call(request, url, options);
  if (response.status === 200) {
    const desUrl = 'http://localhost:5000/descriptors';
    const desOptions = {
      userId: response.data.id,
      descriptor: {...newProfile}
    }
    const saveDescriptors = yield call(request, desUrl, desOptions);
    if (saveDescriptors.status === 200) {
      alert('registered user');
    } else {
      alert('failed saving descriptors');
    }
  } else {
    alert('failed registering user');
  }
}

export default function* loginSaga() {
  yield takeLatest(MAKE_LOGIN, makeLogin);
  yield takeLatest(MAKE_TIME_IN, makeTimeIn);
  yield takeLatest(MAKE_TIME_OUT, makeTimeOut);
  yield takeLatest(MAKE_TODAY_LOGS, makeTodayLogs);
  yield takeLatest(MAKE_LOGOUT, makeLogout);
  yield takeLatest(MAKE_GET_DESCRIPTORS, makeGetDescriptors);
  yield takeLatest(MAKE_REGISTER_USER, makeRegisterUser);
}
