import { combineReducers } from "@reduxjs/toolkit";

let rootReducer;

export default function createReducer(injectedReducers = {}) {
  rootReducer = combineReducers({
    //Default predefined reducer go here. See example below. This also serves to suppress the no reducer error message.
    preDefinedReducer: (state = null) => state,
    //Actual reducers are all added via injection.
    ...injectedReducers
  });

  return rootReducer;
}

// export type RootState = ReturnType<typeof rootReducer>
