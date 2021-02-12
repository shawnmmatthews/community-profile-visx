/* eslint-disable react/prop-types */
import React, { useMemo, useCallback } from "react";
import { Group } from "@visx/group";
import { Circle } from "@visx/shape";
import { Text } from "@visx/text";
import { animated, useSpring } from "react-spring";
import { Pack, hierarchy } from "@visx/hierarchy";
import { scaleOrdinal } from "@visx/scale";
import { useTooltip, useTooltipInPortal, defaultStyles } from "@visx/tooltip";

export type TooltipProps = {
  width: number;
  height: number;
  showControls?: boolean;
};

type TooltipData = {
  key: number;
  name: string;
  value: string;
};

const tooltipStyles = {
  ...defaultStyles,
  minWidth: 60,
  backgroundColor: "rgba(0,0,0,0.9)",
  color: "white"
};

const defaultMargin = { top: 30, left: 20, right: 20, bottom: 0 };

export type PackProps = {
  data: any;
  width: number;
  height: number;
  margin?: { top: number; right: number; bottom: number; left: number };
  events?: boolean;
};

interface Datum {
  name: string;
  Value: number;
}

function percentageOfTotal(value, total) {
  return (value * 100) / total;
}

let tooltipTimeout: number;

const AnimatedCircle = ({
  index,
  circle,
  colorScale,
  handleMouseLeave,
  handleMouseMove
}) => {
  // const wasShowing = useRef(false)
  // useEffect(() => {
  //   wasShowing.current = isShowing
  // }, [isShowing])
  const props = useSpring({
    r: circle.r,
    from: { r: 0 }
  });
  // const CircleWithAnimation = animated(Circle)
  return (
    <animated.circle
      key={`circle-${index}`}
      //@ts-ignored
      r={props.r}
      cx={circle.x}
      cy={circle.y}
      className={`fill-current text-${
        colorScale(circle.data.Value).color
      } hover:text-${colorScale(circle.data.Value).hover}`}
      onMouseLeave={handleMouseLeave}
      onMouseMove={(event) => handleMouseMove(event, circle.data, index)}
    />
  );
};

export default function BubblePack({
  data,
  width,
  height,
  margin = defaultMargin
}: PackProps) {
  const populationTotal = data.reduce(
    (acc, cur) => Number(acc) + Number(cur.Value),
    0
  );

  function extent<D>(allData: D[], value: (d: D) => number): [number, number] {
    return [Math.min(...allData.map(value)), Math.max(...allData.map(value))];
  }

  const pack = { children: data, name: "root", Value: 0 };

  const colorScale = useMemo(
    () =>
      scaleOrdinal({
        domain: extent<Datum>(data, (d) =>
          percentageOfTotal(d.Value, populationTotal)
        ),
        range: [
          { color: "red-400", hover: "red-300" },
          { color: "orange-500", hover: "orange-400" },
          { color: "yellow-400", hover: "yellow-300" },
          { color: "teal-400", hover: "teal-300" },
          { color: "blue-300", hover: "blue-200" },
          { color: "violet-500", hover: "violet-400" },
          { color: "gray-400", hover: "gray-300" }
        ]
      }),
    [data, populationTotal]
  );
  const root = hierarchy<Datum>(pack)
    .sum((d) => Number(percentageOfTotal(d.Value, populationTotal)))
    .sort(
      (a, b) =>
        // sort by hierarchy, then distance
        (a?.data ? 1 : -1) - (b?.data ? 1 : -1) ||
        (a.children ? 1 : -1) - (b.children ? 1 : -1)
      // (a.data.distance == null ? -1 : 1) - (b.data.distance == null ? -1 : 1) ||
      // a.data.distance! - b.data.distance!,
    );

  const {
    showTooltip,
    hideTooltip,
    tooltipOpen,
    tooltipData,
    tooltipLeft,
    tooltipTop
  } = useTooltip<TooltipData>();

  // const tooltipShouldDetectBounds = true;

  const { containerRef, TooltipInPortal, containerBounds } = useTooltipInPortal(
    {
      scroll: true,
      detectBounds: true
    }
  );

  // Tooltip event handlers
  const handleMouseMove = useCallback(
    (event: any, data: any, i: number) => {
      if (tooltipTimeout) clearTimeout(tooltipTimeout);
      // coordinates should be relative to the container in which Tooltip is rendered
      const containerX =
        ("clientX" in event ? event.clientX : 0) - containerBounds.left;
      const containerY =
        ("clientY" in event ? event.clientY : 0) - containerBounds.top;
      showTooltip({
        tooltipTop: containerY,
        tooltipLeft: containerX,
        tooltipData: {
          name: data.Name,
          value: data.Value,
          key: i
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

  return width < 10 ? null : (
    <div className="relative BubblePlot" style={{ width, height }}>
      <svg ref={containerRef} width={width} height={height}>
        <rect
          width={width}
          height={height}
          rx={14}
          className="fill-current text-indigo-50"
        />
        <Text y={margin.top + 10} x={width / 2} textAnchor="middle">
          Race/Ethnicity (Percent of total)
        </Text>
        <Pack<Datum>
          root={root}
          size={[
            width - (margin.left + margin.right),
            height - (margin.top + margin.bottom)
          ]}
        >
          {(packData) => {
            const circles = packData.descendants().slice(1);
            return (
              <Group top={margin.top} left={margin.left}>
                {circles.map((circle, i) => {
                  //const data = circle.data
                  return (
                    <AnimatedCircle
                      key={`circle-${i}`}
                      index={i}
                      circle={circle}
                      colorScale={colorScale}
                      handleMouseLeave={handleMouseLeave}
                      handleMouseMove={handleMouseMove}
                    />
                  );
                })}
              </Group>
            );
          }}
        </Pack>
      </svg>
      {tooltipOpen && tooltipData && (
        <TooltipInPortal
          key={Math.random()}
          top={tooltipTop}
          left={tooltipLeft}
          style={tooltipStyles}
        >
          <div>
            <strong>{tooltipData.name}</strong>
          </div>
          <p>{`${percentageOfTotal(
            tooltipData.value,
            populationTotal
          ).toPrecision(3)}%`}</p>
        </TooltipInPortal>
      )}
    </div>
  );
}
