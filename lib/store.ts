import { configureStore, getDefaultMiddleware } from "@reduxjs/toolkit";
// import logger from 'redux-logger';
import createSagaMiddleware from "redux-saga";
import { createInjectorsEnhancer } from "redux-injectors";
import createReducer from "./reducers";

const devEnv = process.env.NODE_ENV === "development";
const sagaOptions = {};
const sagaMiddleware = createSagaMiddleware(sagaOptions);
const { run: runSaga } = sagaMiddleware;
const middleware = [...getDefaultMiddleware({ thunk: false }), sagaMiddleware];
const enhancers = [
  createInjectorsEnhancer({
    createReducer,
    runSaga
  })
];

// Log actions in Redux. Can be pretty heavy even in dev.
// if (devEnv) {
//   middleware.push(logger);
// }

const store = (preloadedState = {}) => {
  const config = configureStore({
    reducer: createReducer(),
    devTools: devEnv,
    middleware,
    preloadedState,
    enhancers
  });
  return config;
};

export default store;
