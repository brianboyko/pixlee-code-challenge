import {
  SET_PROCESSING,
} from '../constants/index';


//TODO: For now, the switch case will not do anything as action is declared
//as an empty object argument, causing it to always default to return state
//since  action.type will never exist. - GMDIV
export function processing(state = false, action = {}) {
  switch(action.type){
  case SET_PROCESSING:
    return action.status;
  default: return state;
  }
}
