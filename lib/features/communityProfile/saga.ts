import { takeEvery, call, put } from "redux-saga/effects";
import { actions } from "./slice";
import * as d3 from "d3";

const getCommunityProfileData = async () => {
  const data = await d3.csv(
    `https://dpi7d.sse.codesandbox.io/cp_test_2020.csv`
  );
  return data;
};

export function* fetchCommunityProfileData() {
  try {
    const data = yield call(getCommunityProfileData);
    yield put(actions.fetchSuccess({ data }));
  } catch (error) {
    yield put(actions.fetchFailure({ error }));
  }
}

export default function* communityProfileSaga() {
  yield takeEvery(actions.fetch.type, fetchCommunityProfileData);
}
