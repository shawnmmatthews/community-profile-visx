import { useEffect } from 'react';
import { shallowEqual, useSelector, useDispatch } from 'react-redux';
import { useInjectReducer, useInjectSaga } from 'redux-injectors';
import saga from './saga'
import { name, initialState, reducer, actions } from './slice';
import { createSelector } from 'reselect';

//create selector
const selectCommunityProfileData = (state) => state[name] || initialState;

const makeSelectCommunityProfileData = () =>
  createSelector(selectCommunityProfileData, (substate) => substate);

export function useCommunityProfileData(
  // { limit = 20, offset = 0 } = {}
  ) {
  useInjectReducer({ key: name, reducer });
  useInjectSaga({ key: name, saga });

  const dispatch = useDispatch();
  const store = useSelector(makeSelectCommunityProfileData(), shallowEqual);

  useEffect(() => {
    if (!store?.data?.length && !store?.loading) {
      dispatch(
        actions.fetch(),
      );
    }
  }, []);
  return store;
}

export function getHouseholdIncomeDataByJurisdiction(option, data, year) {
  const filteredData = data.filter(dataset => dataset.Jurisdiction === option && dataset.Name.startsWith("Household Income") && Number(dataset.year).toFixed(0) === year ) // Not exactly sure what place means here.
  return filteredData;
}

const raceAndEthnicityOptions = ["Asian", "African American", "Caucasian", "Hispanic or Latino", "Native American", "Native Hawaiian or Pacific Islander", "Other Race"]

export function getRaceAndEthnicityByJurisdiction(option, data, year) {
  const filteredData = data.filter(dataset => dataset.Jurisdiction === option && raceAndEthnicityOptions.includes(dataset.Name)  && Number(dataset.year).toFixed(0) === year ) // Not exactly sure what place means here.
  return filteredData;
}

const demographicsKeys = [
  "DOLA Population",
  "Households",
  "Average Household Size",
  "Median Age",
  "Median Household Income",
  "High School Diploma or More",
  "Bachelor's Degree or More",
  "Single Occupancy Commuters",
  "Unemployment Rate"
];

export function getDemographicsValuesByJurisdiction(option, data, year) {
  const filteredData = data.filter(dataset => dataset.Jurisdiction === option && demographicsKeys.includes(dataset.Name)  && Number(dataset.year).toFixed(0) === year ) // Not exactly sure what place means here.
  return filteredData;
}

const housingKeys = [
  "Housing Units",
  "Occupied Housing",
  "Owner Occupied Housing",
  "Median Home Value",
  "Median Monthly Owner Costs",
  "Renter Occupied Housing",
  "Median Monthly Renter Costs",
  "Multifamily Housing",
  "Vacant Housing"
]

export function getHousingValuesByJurisdiction(option, data, year) {
  const filteredData = data.filter(dataset => dataset.Jurisdiction === option && housingKeys.includes(dataset.Name)  && Number(dataset.year).toFixed(0) === year ) // Not exactly sure what place means here.
  return filteredData;
}