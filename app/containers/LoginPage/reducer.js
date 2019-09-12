/*
 * LoginReducer
 *
 * The reducer takes care of our data. Using actions, we can
 * update our application state. To add a new action,
 * add it to the switch statement in the reducer function
 *
 */

import produce from 'immer';

import { CHANGE_USERNAME, SET_LOGIN, SET_DIALOG, SET_USER, SET_RECORDS, SET_RECORD, SET_LOADING } from './types';

// The initial state of the App
export const initialState = {
  token: '',
  email: '',
  username: '',
  user: {},
  openDialog: false,
  currentUser: {},
  records: [],
  record: {},
  loading: false
};

/* eslint-disable default-case, no-param-reassign */
const loginReducer = (state = initialState, action) =>
  produce(state, draft => {
    switch (action.type) {
      case CHANGE_USERNAME:
        // Delete prefixed '@' from the github username
        draft.username = action.username;
        break;
      case SET_LOGIN:
        draft.token = action.token;
        draft.user = action.user;
        break;
      case SET_DIALOG:
        draft.openDialog = action.status;
        break;
      case SET_USER:
        draft.currentUser = action.user;
        break;
      case SET_RECORDS:
        draft.records = action.records;
        break;
      case SET_RECORD:
        draft.record = action.record;
        break;
      case SET_LOADING:
        draft.loading = action.status;
        break;
    }
  });

export default loginReducer;