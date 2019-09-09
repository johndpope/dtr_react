/*
 *
 * HomePage actions
 *
 */

import { DEFAULT_ACTION, EXPORT_EXCEL } from './types';

export function defaultAction() {
  return {
    type: DEFAULT_ACTION,
  };
}

export const exportExcel = (startDate, endDate, userId) => {
  return {
    type: EXPORT_EXCEL,
    startDate,
    endDate,
    userId
  };
}
