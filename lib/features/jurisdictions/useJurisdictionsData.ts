import { useEffect } from 'react';
import { shallowEqual, useSelector, useDispatch } from 'react-redux';
import { useInjectReducer, useInjectSaga } from 'redux-injectors';
import saga from './saga'
import { name, initialState, reducer, actions } from './slice';
import { createSelector } from 'reselect';

//create selector
const selectJurisdictionsData = (state) => state[name] || initialState;

const makeSelectJurisdictionsData = () =>
  createSelector(selectJurisdictionsData, (substate) => substate);

export function useJurisdictionsData(
  // { limit = 20, offset = 0 } = {}
  ) {
  useInjectReducer({ key: name, reducer });
  useInjectSaga({ key: name, saga });

  const dispatch = useDispatch();
  const store = useSelector(makeSelectJurisdictionsData(), shallowEqual);

  useEffect(() => {
    if (!store?.data?.length && !store?.loading) {
      dispatch(
        actions.fetch(),
      );
    }
  }, []);
  return store;
}