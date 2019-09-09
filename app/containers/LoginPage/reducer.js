/*
 * LoginReducer
 *
 * The reducer takes care of our data. Using actions, we can
 * update our application state. To add a new action,
 * add it to the switch statement in the reducer function
 *
 */

import produce from 'immer';

import { CHANGE_USERNAME, SET_LOGIN } from './types';

// The initial state of the App
export const initialState = {
  token: '',
  email: '',
  username: '',
  user: {}
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
    }
  });

export default loginReducer;