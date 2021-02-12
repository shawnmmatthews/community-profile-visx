import { takeEvery, call, put } from "redux-saga/effects";
import { actions } from "./slice";
import * as d3 from "d3";

const getJurisdictionsData = async () => {
  const data = await d3.csv(
    `https://dpi7d.sse.codesandbox.io/cp_jurisdictions_2020.csv`
  );
  return data;
};

export function* fetchJurisdictionsData() {
  try {
    const data = yield call(getJurisdictionsData);
    yield put(actions.fetchSuccess({ data }));
  } catch (error) {
    yield put(actions.fetchFailure({ error }));
  }
}

export default function* jurisdictionsSaga() {
  yield takeEvery(actions.fetch.type, fetchJurisdictionsData);
}
