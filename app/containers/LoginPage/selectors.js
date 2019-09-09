/**
 * LoginPage selectors
 */

import { createSelector } from 'reselect';
import { initialState } from './reducer';

const selectLogin = state => state.home || initialState;

const makeSelectUsername = () =>
  createSelector(
    selectLogin,
    loginState => loginState.username,
  );

export { selectLogin, makeSelectUsername };