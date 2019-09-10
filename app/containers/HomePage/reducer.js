/*
 *
 * HomePage reducer
 *
 */
import produce from 'immer';
import { DEFAULT_ACTION } from './constants';
import { SET_RESPONSE } from './types';

export const initialState = {
  response: null
};

/* eslint-disable default-case, no-param-reassign */
const homePageReducer = (state = initialState, action) =>
  produce(state, (draft) => {
    switch (action.type) {
      case DEFAULT_ACTION:
        break;
      case SET_RESPONSE:
          draft.response = action.response;
          break;
    }
  });

export default homePageReducer;
