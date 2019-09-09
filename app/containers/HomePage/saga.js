import { takeLatest, call, put, select } from 'redux-saga/effects';
import { EXPORT_EXCEL } from './types';
import request from 'utils/request';

export function* makeExportExcel(action) {
  const { startDate, endDate, userId } = action;
  const url = 'http://localhost:5000/record/export_excel';
  const options = {
    startDate,
    endDate,
    userId
  };
  const response = yield call(request, url, options);
  return response;
}

// Individual exports for testing
export default function* homePageSaga() {
  // See example in containers/HomePage/saga.js
  yield takeLatest(EXPORT_EXCEL, makeExportExcel);
}
