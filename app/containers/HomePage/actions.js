/*
 *
 * HomePage actions
 *
 */

import { DEFAULT_ACTION, EXPORT_EXCEL, SET_RESPONSE, SET_LOADING } from './types';

export function defaultAction() {
  return {
    type: DEFAULT_ACTION,
  };
}

export const exportExcel = (param) => {
  return {
    type: EXPORT_EXCEL,
    param
  };
}

export const setResponse = (response) => {
  return {
    type: SET_RESPONSE,
    response
  }
}

export const setLoading = (status) => {
  return {
    type: SET_LOADING,
    status
  }
}
