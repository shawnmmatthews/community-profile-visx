/* eslint-disable react/prop-types */
import React, { useCallback, useMemo } from "react";
import { Bar } from "@visx/shape";
import { Group } from "@visx/group";
//import { Grid } from '@visx/grid';
import { AxisBottom } from "@visx/axis";
import { scaleBand, scaleLinear, scaleOrdinal } from "@visx/scale";
import { animated, useSpring } from "react-spring";
import { useTooltip, useTooltipInPortal, defaultStyles } from "@visx/tooltip";
import { Text } from "@visx/text";

export type BarProps = {
  data: any;
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
  name: string;
  value: string;
};

const tooltipStyles = {
  ...defaultStyles,
  minWidth: 60,
  backgroundColor: "rgba(0,0,0,0.9)",
  color: "white"
};

let tooltipTimeout: number;

const defaultMargin = { top: 60, right: 40, bottom: 120, left: 40 };

// accessors
const getIncomeRange = (d) => d.Name;
const getIncomePercentage = (d) => Number(d.Value);

function percentageOfTotal(value, total) {
  return (value * 100) / total;
}

const AnimatedBar = ({
  index,
  bar,
  barX,
  barY,
  barWidth,
  barHeight,
  handleMouseLeave,
  handleMouseMove
}) => {
  const props = useSpring({
    from: { height: 0, y: 0 },
    to: { height: barHeight, y: barY }
  });

  //const BarWithHeightAnimation = animated(Bar)
  return (
    <animated.rect
      {...props}
      key={`bar-${index}`}
      x={barX}
      width={barWidth}
      className="fill-current text-violet-500 hover:text-violet-400"
      onMouseLeave={handleMouseLeave}
      onMouseMove={(event) => handleMouseMove(event, bar)}
    />
  );
};

export default function BarGraph({
  data,
  width,
  height,
  margin = defaultMargin
}: BarProps) {
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
    (event: any, data: any) => {
      // if (tooltipTimeout) clearTimeout(tooltipTimeout);
      // coordinates should be relative to the container in which Tooltip is rendered
      const containerX =
        ("clientX" in event ? event.clientX : 0) - containerBounds.left;
      const containerY =
        ("clientY" in event ? event.clientY : 0) - containerBounds.top;
      showTooltip({
        tooltipLeft: containerX,
        tooltipTop: containerY,
        tooltipData: {
          name: data.Name,
          value: data.Value
        }
      });
    },
    [containerBounds, showTooltip]
  );

  const handleMouseLeave = useCallback(() => {
    tooltipTimeout = window.setTimeout(() => {
      hideTooltip();
    }, 50);
  }, [hideTooltip]);

  const xMax = width - margin.left - margin.right;
  const yMax = height - margin.top - margin.bottom;

  // scales, memoize for performance
  const xScale = useMemo(
    () =>
      scaleBand<string>({
        range: [0, xMax],
        round: true,
        domain: data.map(getIncomeRange),
        padding: 0.4
      }),
    [xMax, data]
  );
  const yScale = useMemo(
    () =>
      scaleLinear<number>({
        range: [yMax, 0],
        round: true,
        domain: [0, Math.max(...data.map(getIncomePercentage))]
      }),
    [yMax, data]
  );

  const incomeTotal = data.reduce(
    (acc, cur) => Number(acc) + Number(cur.Value),
    0
  );

  return width < 10 ? null : (
    // relative position is needed for correct tooltip positioning
    <div style={{ width, height }} className="relative" ref={containerRef}>
      {" "}
      {/* onPointerMove={handlePointerMove} */}
      <svg width={width} height={height}>
        {" "}
        {/* NEEDED FOR TOOLTIP PORTAL*/}
        <rect
          x={0}
          y={0}
          width={width}
          height={height}
          className="fill-current text-indigo-50"
          rx={14}
        />
        <Text y={margin.top - 20} x={width / 2} textAnchor="middle">
          Income (Percent of total)
        </Text>
        <Group top={margin.top} left={margin.left}>
          {data.map((bar, index) => {
            const income = getIncomeRange(bar);
            const barWidth = xScale.bandwidth();
            const barHeight = yMax - (yScale(getIncomePercentage(bar)) ?? 0);
            const barX = xScale(income);
            const barY = yMax - barHeight;
            return (
              <g key={`group-${index}`}>
                <AnimatedBar
                  index={index}
                  bar={bar}
                  barX={barX}
                  barY={barY}
                  barWidth={barWidth}
                  barHeight={barHeight}
                  handleMouseLeave={handleMouseLeave}
                  handleMouseMove={handleMouseMove}
                />
                <Text
                  className="text-xs"
                  verticalAnchor="start"
                  textAnchor="middle"
                  x={barX + barWidth / 2}
                  y={barY - 12}
                >
                  {`${percentageOfTotal(bar.Value, incomeTotal).toPrecision(
                    3
                  )}%`}
                </Text>
              </g>
            );
          })}
        </Group>
        <AxisBottom
          top={yMax + margin.top}
          left={margin.left}
          scale={xScale}
          //tickFormat={formatDate}
          stroke="#cccccc"
          tickStroke="#cccccc"
          tickComponent={(props) => {
            const { x, y, formattedValue } = props;
            return (
              <Text
                angle={-90}
                width={127}
                dy={-4}
                dx={15}
                fill="#666666"
                fontSize={11}
                x={x}
                y={y}
                textAnchor="end"
              >
                {`${formattedValue}`}
              </Text>
            );
          }}
        />
      </svg>
      {tooltipOpen && tooltipData && (
        <TooltipInPortal
          key={Math.random()}
          top={tooltipTop}
          left={tooltipLeft}
          style={tooltipStyles}
        >
          <div>
            <p>
              <strong>{tooltipData.name}</strong>
            </p>
          </div>
          <p>
            % of Households:{" "}
            {`${percentageOfTotal(tooltipData.value, incomeTotal).toPrecision(
              3
            )}%`}
          </p>
        </TooltipInPortal>
      )}
    </div>
  );
}
