import { combineReducers } from 'redux-immutable';
import globals from './globals';
import route from './route';
import algolia from './algolia';
import login from './login';


const applicationReducers = {
  globals,
  route,
  algolia,
  login,
};

export default function createReducer() {
  return combineReducers(applicationReducers);
}
