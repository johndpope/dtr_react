/*
 * Login Actions
 *
 * Actions change things in your application
 * Since this boilerplate uses a uni-directional data flow, specifically redux,
 * we have these actions which are the only way your application interacts with
 * your application state. This guarantees that your state is up to date and nobody
 * messes it up weirdly somewhere.
 *
 * To add a new Action:
 * 1) Import your constant
 * 2) Add a function like this:
 *    export function yourAction(var) {
 *        return { type: YOUR_ACTION_CONSTANT, var: var }
 *    }
 */

import { CHANGE_USERNAME, MAKE_LOGIN, SET_LOGIN, MAKE_TIME_IN, MAKE_TIME_OUT } from './types';

/**
 * Changes the input field of the form
 *
 * @param  {string} username The new text of the input field
 *
 * @return {object} An action object with a type of CHANGE_USERNAME
 */
export function changeUsername(username) {
  return {
    type: CHANGE_USERNAME,
    username,
  };
}

export const makeLogin = (email, password) => ({
  type: MAKE_LOGIN,
  email,
  password
});

export const makeTimeIn = (email, password) => ({
  type: MAKE_TIME_IN,
  email,
  password
});

export const makeTimeOut = (email, password) => ({
  type: MAKE_TIME_OUT,
  email,
  password
});

export const setLogin = (token, user) => ({
  type: SET_LOGIN,
  token,
  user
});