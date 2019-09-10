import { takeLatest, call, put, select } from 'redux-saga/effects';
import { EXPORT_EXCEL } from './types';
import { getRequest, postRequest } from 'utils/request';
import { setResponse } from './actions';
import axios from 'axios';

const downloadFile = (url, param) => {
  return axios({
    method: 'POST',
    url,
    data: {
      ...param
    },
    responseType: 'arraybuffer'
  });
}

export function* makeExportExcel(action) {
  const { startDate, endDate, userId } = action;
  const url = 'http://localhost:5000/record/export_excel';
  const param = {
    startDate,
    endDate,
    userId
  };
  const response = yield call(downloadFile, url, param);
  const binaryData = [];
  binaryData.push(response.data);
  const objectUrl = window.URL.createObjectURL(new Blob(binaryData));

  // Create a new anchor element
  const a = document.createElement('a');

  a.href = objectUrl;
  a.download = 'new_excel.xlsx';
  const clickHandler = () => {
    setTimeout(() => {
      window.URL.revokeObjectURL(objectUrl);
    }, 150);
  };
  
  a.addEventListener('click', clickHandler, false);
  
  a.click();
}

// Individual exports for testing
export default function* homePageSaga() {
  // See example in containers/HomePage/saga.js
  yield takeLatest(EXPORT_EXCEL, makeExportExcel);
}
