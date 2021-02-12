import React from 'react'

interface DemographicsProps {
  demographicsData: any,
}

interface HousingProps {
  housingData: any,
}

const DemographicsTable = ({ demographicsData}: DemographicsProps) => {
  return (
    <div className="w-full h-full">
        <p className="my-2 text-center">Demographics</p>
          <div className="flex flex-col">
              <div className="inline-block min-w-full align-middle">
                <div className="pb-6 overflow-hidden">
                  <table className="min-w-full border border-indigo-50">
                    <tbody>
                      {demographicsData.map((data, index) => {
                        return (
                          <tr key={index} className={index % 2 === 0 ? "bg-white" : "bg-indigo-50"}>
                            <td className="px-3 py-2 text-xs font-medium text-gray-900 whitespace-nowrap">
                              {data.Name}
                            </td>
                            <td className="px-3 py-2 text-xs text-right text-gray-500 whitespace-nowrap">
                              {parseInt(`${data.Value}`).toLocaleString()}
                            </td>
                          </tr>
                        )
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
  )
}

const HousingTable = ({housingData}: HousingProps) => {
  return (
    <div className="w-full h-full">
        <p className="my-2 text-center ">Housing</p>
        <div className="flex flex-col">
              <div className="inline-block min-w-full align-middle">
                <div className="pb-6 overflow-hidden">
                  <table className="min-w-full border border-indigo-50">
                    <tbody>
                      {housingData.map((data, index) => {
                        return (
                          <tr key={index} className={index % 2 === 0 ? "bg-white" : "bg-indigo-50"}>
                            <td className="px-3 py-2 text-xs font-medium text-gray-900 whitespace-nowrap">
                              {data.Name}
                            </td>
                            <td className="px-3 py-2 text-xs text-right text-gray-500 whitespace-nowrap">
                              {parseInt(`${data.Value}`).toLocaleString()}
                            </td>
                          </tr>
                        )
                      })}
                    </tbody>
                  </table>
                </div>
            </div>
          </div>
    </div>
  )
}

export {HousingTable, DemographicsTable};