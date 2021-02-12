/* eslint-disable react/prop-types */
import React, { useState, useEffect } from "react";
import BarChart from "../lib/features/communityProfile/BarChart";
import Pyramid from "../lib/features/populationPyramid/Pyramid";
import BubblePack from "../lib/features/communityProfile/BubblePack";
import {
  DemographicsTable,
  HousingTable
} from "../lib/features/communityProfile/Table";
import ParentSize from "@visx/responsive/lib/components/ParentSize";
import * as d3 from "d3";
// import Tooltip from '../lib/features/communityProfile/EnhancedTooltip'
import {
  useCommunityProfileData,
  getHouseholdIncomeDataByJurisdiction,
  getRaceAndEthnicityByJurisdiction,
  getDemographicsValuesByJurisdiction,
  getHousingValuesByJurisdiction
} from "../lib/features/communityProfile/useCommunityProfileData";

function YearDropDown({ year, handleYearChange }) {
  function generateYears(startYear, endYear) {
    let years = [];
    while (startYear <= endYear) {
      years.push(startYear++);
    }
    return years;
  }
  return (
    <div className="flex h-full pl-4">
      <p className="pr-1">Year:</p>
      <select value={year} onChange={handleYearChange}>
        {generateYears(2010, 2018).map((year) => (
          <option key={year} value={year}>
            {year}
          </option>
        ))}
      </select>
    </div>
  );
}

function JurisdictionDropDown({ jurisdiction, handleJurisdictionChange }) {
  const [loading, setLoading] = useState(true);
  const [items, setItems] = useState([]);

  useEffect(() => {
    let unmounted = false;
    async function getJurisdictions() {
      const response = await d3.csv(
        `https://dpi7d.sse.codesandbox.io/cp_jurisdictions_2020.csv`
      );
      if (!unmounted) {
        setItems(
          response.map(({ Jurisdiction }) => ({
            label: Jurisdiction,
            value: Jurisdiction
          }))
        );
        setLoading(false);
      }
    }
    getJurisdictions();
  }, []);
  return (
    <div className="flex h-full pl-4">
      <p className="pr-1">Jurisdiction:</p>
      <select
        disabled={loading}
        value={jurisdiction}
        onChange={handleJurisdictionChange}
      >
        {items.map(({ label, value }) => (
          <option key={value} value={value}>
            {label}
          </option>
        ))}
      </select>
    </div>
  );
}

export default function CommunityProfiles() {
  const [jurisdiction, setJurisdiction] = useState("Region");
  const [year, setYear] = useState("2018");
  const { status, data, loading, error } = useCommunityProfileData();
  const handleJurisdictionChange = (e) =>
    setJurisdiction(e.currentTarget.value);
  const handleYearChange = (e) => setYear(e.currentTarget.value);
  // const [jurisdictions, setJurisdiction] = useState()

  // const Add = jurisdictionList.map(Add => Add
  // )
  // const handleAddrTypeChange = (e) => console.log((addrtype[e.target.value]))

  return (
    // <>
    // {loading ? <p>loading</p> :
    <>
      {data ? (
        <div className="px-4 mx-auto max-w-7xl sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-10 lg:grid-rows-10">
            <div
              className="flex h-full col-span-1 bg-indigo-50 md:col-span-2 lg:row-span-1 lg:row-start-1 lg:col-span-6 lg:col-start-1"
              style={{ borderRadius: "14px" }}
            >
              <JurisdictionDropDown
                jurisdiction={jurisdiction}
                handleJurisdictionChange={handleJurisdictionChange}
              />
              <YearDropDown year={year} handleYearChange={handleYearChange} />
            </div>
            <div
              className="col-span-1 bg-indigo-50 md:col-span-1 lg:col-span-3 lg:col-start-1 lg:row-span-4 lg:row-start-2"
              style={{ borderRadius: "14px" }}
            >
              <DemographicsTable
                demographicsData={getDemographicsValuesByJurisdiction(
                  jurisdiction,
                  data,
                  year
                )}
              />
            </div>
            <div
              className="col-span-1 bg-indigo-50 md:col-span-1 lg:col-span-3 lg:col-start-4 lg:row-span-4 lg:row-start-2"
              style={{ borderRadius: "14px" }}
            >
              <HousingTable
                housingData={getHousingValuesByJurisdiction(
                  jurisdiction,
                  data,
                  year
                )}
              />
            </div>
            <div className="col-span-1 md:col-span-1 lg:col-span-4 lg:col-start-7 lg:row-span-5 lg:row-start-1">
              <ParentSize>
                {({ width, height }) => (
                  <BubblePack
                    data={getRaceAndEthnicityByJurisdiction(
                      jurisdiction,
                      data,
                      year
                    )}
                    width={width}
                    height={height}
                  />
                )}
              </ParentSize>
            </div>
            <div className="col-span-1 md:col-span-1 lg:col-span-5 lg:row-span-5 lg:row-start-6 h-96">
              <ParentSize>
                {({ width, height }) => (
                  <BarChart
                    data={getHouseholdIncomeDataByJurisdiction(
                      jurisdiction,
                      data,
                      year
                    )}
                    width={width}
                    height={height}
                  />
                )}
              </ParentSize>
            </div>
            <div className="col-span-1 md:col-span-2 lg:col-span-5 lg:col-start-6 lg:row-span-5 lg:row-start-6 h-96">
              <ParentSize>
                {({ width, height }) => (
                  <Pyramid
                    year={year}
                    jurisdiction={jurisdiction}
                    width={width}
                    height={height}
                  />
                )}
              </ParentSize>
            </div>
          </div>
        </div>
      ) : null}
    </>
    // }
    // </>
  );
}
