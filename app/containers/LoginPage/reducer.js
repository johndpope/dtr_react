/*
 * LoginReducer
 *
 * The reducer takes care of our data. Using actions, we can
 * update our application state. To add a new action,
 * add it to the switch statement in the reducer function
 *
 */

import produce from 'immer';

import {
  CHANGE_USERNAME,
  SET_LOGIN,
  SET_DIALOG,
  SET_USER,
  SET_RECORDS,
  SET_RECORD,
  SET_LOADING,
  SET_DESCRIPTORS,
} from './types';

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
  loading: false,
  descriptors: null,
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
      case SET_DESCRIPTORS:
        const newDescriptors = {};
        action.descriptors.forEach(desc => {
          const key = Object.keys(desc.descriptor)[0];
          const descArr = desc.descriptor[key].descriptors[0];
          const newDesc = Object.keys(descArr).map(k => descArr[k]);
          newDescriptors[key] = {
            // id: desc.id,
            // userId: desc.userId,
            name: desc.descriptor[key].name,
            descriptors: [new Float32Array(newDesc)],
          };
        });

        

        draft.descriptors = newDescriptors;
        break;
    }
  });

export default loginReducer;
