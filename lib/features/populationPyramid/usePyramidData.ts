import { useEffect } from 'react';
import { shallowEqual, useSelector, useDispatch } from 'react-redux';
import { useInjectReducer, useInjectSaga } from 'redux-injectors';
import saga from './saga'
import { name, initialState, reducer, actions } from './slice';
import { createSelector } from 'reselect';

//create selector
const selectPyramidData = (state) => state[name] || initialState;

const makeSelectPyramidData = () =>
  createSelector(selectPyramidData, (substate) => substate);

export function usePyramidData(
  // { limit = 20, offset = 0 } = {}
  ) {
  useInjectReducer({ key: name, reducer });
  useInjectSaga({ key: name, saga });

  const dispatch = useDispatch();
  const store = useSelector(makeSelectPyramidData(), shallowEqual);

  useEffect(() => {
    // if (!store?.data?.length && !store?.loading) {
      dispatch(
        actions.fetch(),
      );
    // }
  }, []);
  return store;
}

export function getDataByJurisdiction(option, data, year) {
  const filteredData = data.filter(dataset => dataset.Jurisdiction === option && Number(dataset.year).toFixed(0) === year);
  return filteredData;
}