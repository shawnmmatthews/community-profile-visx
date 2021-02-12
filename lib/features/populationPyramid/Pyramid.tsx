/* eslint-disable react/prop-types */
import React, { useCallback, useMemo } from "react";
import { Bar } from "@visx/shape";
import { Group } from "@visx/group";
import { animated, useSpring } from "react-spring";
import { Orientation, SharedAxisProps, AxisScale, AxisLeft } from "@visx/axis";
import {
  AnimatedAxis,
  AnimatedGridRows,
  AnimatedGridColumns
  //@ts-ignore
} from "@visx/react-spring";
import { scaleBand, scaleLinear, scaleOrdinal } from "@visx/scale";
import { useTooltip, useTooltipInPortal, defaultStyles } from "@visx/tooltip";
import { Text } from "@visx/text";
import { usePyramidData, getDataByJurisdiction } from "./usePyramidData";

export type PyramidProps = {
  year: string;
  jurisdiction: string;
  width: number;
  height: number;
  margin?: { top: number; right: number; bottom: number; left: number };
  events?: boolean;
};

export type TooltipProps = {
  width: number;
  height: number;
  showControls?: boolean;
};

type TooltipData = {
  age: string;
  data: any;
  gender: string;
};

const tooltipStyles = {
  ...defaultStyles,
  minWidth: 60,
  backgroundColor: "rgba(0,0,0,0.9)",
  color: "white"
};

let tooltipTimeout: number;

const defaultMargin = { top: 50, right: 30, bottom: 60, left: 60 };

// accessors
const getMales = (d: any) => Number(d.Males);
const getFemales = (d: any) => Number(d.Females);
const getAgeRange = (d: any) => d.Age;

const AnimatedBar = ({
  index,
  className,
  bar,
  barX,
  barY,
  barWidth,
  barHeight,
  handleMouseLeave,
  handleMouseMove
}) => {
  const props = useSpring({
    from: { width: 0, x: 0 },
    to: { width: Math.max(0, barWidth), x: barX }
  });
  // const BarWithHeightAnimation = animated.bar
  return (
    <animated.rect
      {...props}
      height={barHeight}
      key={`bar-${index}`}
      y={barY}
      className={className}
      onMouseLeave={handleMouseLeave}
      onMouseMove={(event) => handleMouseMove(event, bar)}
    />
  );
};

export default function Pyramid({
  year,
  jurisdiction,
  width,
  height,
  events = false,
  margin = defaultMargin
}: PyramidProps) {
  const { status, data, loading, error } = usePyramidData();
  const filteredData = getDataByJurisdiction(jurisdiction, data, year);

  const {
    showTooltip,
    hideTooltip,
    tooltipOpen,
    tooltipData,
    tooltipLeft,
    tooltipTop
  } = useTooltip<TooltipData>();

  const { containerRef, TooltipInPortal, containerBounds } = useTooltipInPortal(
    {
      scroll: true,
      detectBounds: true
    }
  );

  // Tooltip event handlers
  const handleMouseMove = useCallback(
    (event: any, age: any, data: string, gender: string) => {
      if (tooltipTimeout) clearTimeout(tooltipTimeout);
      // coordinates should be relative to the container in which Tooltip is rendered
      const containerX =
        ("clientX" in event ? event.clientX : 0) - containerBounds.left;
      const containerY =
        ("clientY" in event ? event.clientY : 0) - containerBounds.top;
      showTooltip({
        tooltipLeft: containerX,
        tooltipTop: containerY,
        tooltipData: {
          age,
          data,
          gender
        }
      });
    },
    [showTooltip, containerBounds]
  );

  const handleMouseLeave = useCallback(() => {
    tooltipTimeout = window.setTimeout(() => {
      hideTooltip();
    }, 50);
  }, [hideTooltip]);

  const xMax = width - margin.left - margin.right;
  const yMax = height - margin.top - margin.bottom;

  // scales, memoize for performance
  const yScale = useMemo(
    () =>
      scaleBand<string>({
        range: [yMax, 0],
        round: true,
        domain: filteredData.map(getAgeRange),
        padding: 0.4
      }),
    [yMax, filteredData]
  );
  const maleScale = useMemo(
    () =>
      scaleLinear<number>({
        range: [0, xMax / 2],
        round: true,
        domain: [Math.max(...filteredData.map(getMales)) * 1.33, 0]
      }),
    [xMax, filteredData]
  );

  const femaleScale = useMemo(
    () =>
      scaleLinear<number>({
        range: [0, xMax / 2],
        round: true,
        domain: [0, Math.max(...filteredData.map(getFemales)) * 1.33]
      }),
    [xMax, filteredData]
  );

  return !data ? null : (
    // relative position is needed for correct tooltip positioning
    <div className="relative BubblePlot" style={{ width, height }}>
      <svg width={width} height={height} ref={containerRef}>
        <rect
          x={0}
          y={0}
          width={width}
          height={height}
          className="fill-current text-indigo-50"
          rx={14}
        />
        <Text y={margin.top - 10} x={width / 2} textAnchor="middle">
          Populdation Pyramid (Count by age group)
        </Text>
        <Group top={margin.top} left={margin.left}>
          <Group className="Male">
            {filteredData.map((bar) => {
              const ageRange = getAgeRange(bar);
              const barHeight = yScale.bandwidth();
              const barWidth = maleScale(getMales(bar)) ?? 0;
              const barY = yScale(ageRange);
              const barX = barWidth;
              return (
                <g key={`group-${ageRange}-male`}>
                  <AnimatedBar
                    index={`bar-${ageRange}-male`}
                    bar={bar}
                    barX={barX} //using a scale of zero starts bars on
                    barY={barY}
                    barWidth={xMax / 2 - barWidth}
                    barHeight={barHeight}
                    className="text-blue-300 fill-current hover:text-blue-200"
                    handleMouseLeave={handleMouseLeave}
                    handleMouseMove={(event) =>
                      handleMouseMove(
                        event,
                        ageRange,
                        Number(bar.Males).toLocaleString(),
                        "Male"
                      )
                    }
                  />
                  <Text
                    key={`text-${ageRange}-male`}
                    className="text-xs"
                    verticalAnchor="start"
                    textAnchor="end"
                    x={barWidth - 5}
                    y={barY}
                  >
                    {Number(bar.Males).toLocaleString()}
                  </Text>
                </g>
              );
            })}
            <AnimatedAxis
              orientation={Orientation.bottom}
              top={yMax}
              // left={xMax}
              scale={maleScale}
              numTicks={4}
              //tickFormat={formatDate}
              stroke="#cccccc"
              tickStroke="#cccccc"
              tickLabelProps={() => ({
                fill: "#666666",
                fontSize: 11,
                textAnchor: "middle"
                // transform: `rotate(45)`,
              })}
              animationTrajectory="max"
            />
          </Group>
          <Group className="Female">
            {filteredData.map((bar) => {
              const ageRange = getAgeRange(bar);
              const barHeight = yScale.bandwidth();
              const barWidth = femaleScale(getFemales(bar)) ?? 0;
              const barY = yScale(ageRange);
              const barX = xMax / 2;
              return (
                <g key={`group-${ageRange}-female`}>
                  <AnimatedBar
                    index={`bar-${ageRange}-female`}
                    bar={bar}
                    barX={barX}
                    barY={barY}
                    barWidth={barWidth}
                    barHeight={barHeight}
                    className="text-red-400 fill-current hover:text-red-300"
                    handleMouseLeave={handleMouseLeave}
                    handleMouseMove={(event) =>
                      handleMouseMove(
                        event,
                        ageRange,
                        Number(bar.Females).toLocaleString(),
                        "Female"
                      )
                    }
                  />
                  <Text
                    key={`text-${ageRange}-female`}
                    className="text-xs"
                    verticalAnchor="start"
                    textAnchor="start"
                    x={xMax / 2 + barWidth + 5}
                    y={barY}
                  >
                    {Number(bar.Females).toLocaleString()}
                  </Text>
                </g>
              );
            })}
            <AnimatedAxis
              orientation={Orientation.bottom}
              top={yMax}
              left={xMax / 2}
              scale={femaleScale}
              numTicks={4}
              //tickFormat={formatDate}
              stroke="#cccccc"
              tickStroke="#cccccc"
              tickLabelProps={() => ({
                fill: "#666666",
                fontSize: 11,
                textAnchor: "middle"
                // transform: `rotate(45)`,
              })}
              animationTrajectory="min"
            />
          </Group>
          <AxisLeft
            // top={margin.top}
            // left={margin.left}
            scale={yScale}
            numTicks={18}
            //tickFormat={formatDate}
            stroke="#cccccc"
            tickStroke="#cccccc"
            tickLabelProps={() => ({
              fill: "#666666",
              fontSize: 11,
              textAnchor: "end",
              dy: "0.33em"
            })}
          />
        </Group>
        <Text y={height - 20} x={width / 4} textAnchor="middle">
          Males
        </Text>
        <Text y={height - 20} x={(width / 4) * 3} textAnchor="middle">
          Females
        </Text>
      </svg>
      {tooltipOpen && tooltipData && (
        <TooltipInPortal
          key={Math.random()}
          top={tooltipTop}
          left={tooltipLeft}
          style={tooltipStyles}
        >
          <div>
            <strong>Age: {tooltipData.age}</strong>
          </div>
          <p>
            {tooltipData.gender}: {tooltipData.data}
          </p>
        </TooltipInPortal>
      )}
    </div>
  );
}
