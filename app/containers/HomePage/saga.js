import { takeLatest, call, put, select } from 'redux-saga/effects';
import { EXPORT_EXCEL } from './types';
import { getRequest, postRequest } from 'utils/request';
import { setResponse, setLoading } from './actions';
import axios from 'axios';
import moment from 'moment';

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
  yield put(setLoading(true));
  const { startDate, endDate, userId, template, exportName, project, client } = action.param;
  let startMoment = moment(startDate);
  startMoment.set({hour:0,minute:0,second:0,millisecond:999});
  let endMoment = moment(endDate);
  endMoment.set({hour:23,minute:59,second:59,millisecond:999});
  const url = 'http://localhost:5000/record/export_excel';
  const param = {
    startDate: startMoment.toISOString(),
    endDate: endMoment.toISOString(),
    userId,
    template,
    project,
    client
  };
  const response = yield call(downloadFile, url, param);

  yield put(setLoading(false));
  const binaryData = [];
  binaryData.push(response.data);
  const objectUrl = window.URL.createObjectURL(new Blob(binaryData));

  // Create a new anchor element
  const a = document.createElement('a');

  a.href = objectUrl;
  a.download = `${exportName}.xlsx`;
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
