import { takeEvery, call, put } from "redux-saga/effects";
import { actions } from "./slice";
import * as d3 from "d3";

const getPyramidData = async () => {
  const data = await d3.csv(
    `https://dpi7d.sse.codesandbox.io/cp_pyramid_2020.csv`
  );
  return data;
};

export function* fetchPyramidData() {
  try {
    const data = yield call(getPyramidData);
    yield put(actions.fetchSuccess({ data }));
  } catch (error) {
    yield put(actions.fetchFailure({ error }));
  }
}

export default function* populationPyramidSaga() {
  yield takeEvery(actions.fetch.type, fetchPyramidData);
}
