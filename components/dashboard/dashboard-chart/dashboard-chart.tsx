/**
 * @fileoverview Insight Chart Component
 *
 * Uses 'any' for chart configuration and data to align with UI library requirements.
 */
/* eslint-disable @typescript-eslint/no-explicit-any */

"use client";

import { Dispatch, SetStateAction, useMemo, useState } from "react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  XAxis,
  Line,
  LineChart,
  YAxis,
  ReferenceLine,
  Cell,
} from "recharts";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";

import { getSumDetailsByKeys } from "./dashboard-chart.utils";
import { ChartProps } from "./dashboard-chart.types";
import { Skeleton } from "@/components/ui/skeleton";

/**
 * Insight Chart Card - chart component within a card that can be a line or bar chart
 *  - `type` historical: displays a line chart
 *  - `type` latest: displays a bar chart
 *  UI rel.: Card / recharts chart ( LineChart + Line / BarChart + Bar )
 */
export function InsightChart<T extends Record<string, unknown>>(props: ChartProps<T>) {

  if(!props?.data) return <ChartSkeleton />

  const {
    data,
    config,
    cardHeader,
    XAxisKey,
    YAxisKey,
    type,
    tooltipLabelFormatter,
  } = props



  const ShapeChart = type === "historical" ? LineChart : BarChart;
  const isHistorical = type === "historical";
  const isLatest = type === "latest";

  const [activeChart, setActiveChart] = useState<keyof typeof config>(
    cardHeader?.views[0] || ""
  );
  const [selectedCellIndex, setSelectedCellIndex] = useState<number | null>(null);

  const shouldSetHeader = cardHeader && data; // TODO: checks to satisfy expectation


  const handleCellClick = (entry: Record<string, unknown>, index: number) => {
    setSelectedCellIndex(selectedCellIndex === index ? null : index);
    console.log("Cell clicked:", { entry, index });
  };

  const getCellColor = (index: number, defaultColor: string | undefined) => {
    return selectedCellIndex === index ? "#ef4444" : (defaultColor || "#000000");
  };

  return (
    <Card className="py-0">
      {/* Card Header - Graph Insights Info */}
      {shouldSetHeader && (
        <ChartCardHeader
          activeChart={activeChart}
          setActiveChart={setActiveChart}
          cardHeader={cardHeader}
          config={config}
          data={data}
        />
      )}

      {/* Card Content - Graph */}
      <CardContent className="px-2 sm:p-6">
        <ChartContainer config={config} className="aspect-auto h-62.5 w-full">
          <ShapeChart
            accessibilityLayer
            data={data}
            margin={{ left: 12, right: 12 }}
            {...(type === "latest" && { layout: "vertical" })}
          >
            <CartesianGrid vertical={false} />
            {/* -------------------------------------------------------------------------- */
            /*                        Line Chart - Axes Controller                        */
            /* -------------------------------------------------------------------------- */}
            {isHistorical && <XAxis dataKey={YAxisKey} />}

            {/* -------------------------------------------------------------------------- */
            /*                   Horizontal Bar Chart - Axes Controllers                  */
            /* -------------------------------------------------------------------------- */}

            {isLatest && (
              <ReferenceLine x={0} stroke="var(--muted-foreground)" />
            )}
            {isLatest && <XAxis type="number" dataKey={XAxisKey} hide />}
            {isLatest && <YAxis type="category" dataKey={YAxisKey} hide />}

            {/* ------------------------------------ - ----------------------------------- */}
            <ChartTooltip
              content={
                <ChartTooltipContent
                  className="w-40"
                  {...(tooltipLabelFormatter && {
                    labelFormatter: tooltipLabelFormatter,
                  })}
                />
              }
            />
            {/* -------------------------------------------------------------------------- */
            /*                    Line Chart - Graph Vector Controller                    */
            /* -------------------------------------------------------------------------- */}
            {isHistorical && (
              <Line
                dataKey={activeChart}
                radius={4}
                type="natural"
              />
            )}
            {/* -------------------------------------------------------------------------- */
            /*                     Bar Chart - Graph Vector Controller                    */
            /* -------------------------------------------------------------------------- */}
            {isLatest && (
              <Bar
                dataKey={activeChart}
                radius={4}
                type="natural"
              >
                {data && data.map((entry: Record<string, unknown>, index: number) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={getCellColor(index, config[activeChart].color)}
                    style={{ cursor: "pointer" }}
                    onClick={() => handleCellClick(entry, index)}
                  />
                ))}
              </Bar>
            )}
          </ShapeChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}

/** ChartCardHeader - Displays chart infos with ability to set views based on total insights  */
export const ChartCardHeader = ({
  activeChart,
  setActiveChart,
  cardHeader,
  data,
  config,
}: {
  activeChart: string;
  setActiveChart: Dispatch<SetStateAction<string>>;
  cardHeader?: any;
  data?: any[];
  config?: any;
}) => {
  /** Total Insights - total value per view */
  const infos = cardHeader?.views || null;
  const total = useMemo(() => {
    const shouldCreateTotal = infos?.length && data?.length;
    return shouldCreateTotal ? getSumDetailsByKeys(data as Record<string, any>[], infos) : null;
  }, [data, infos]);

  if (!data || !cardHeader) return null;

  return (
    <CardHeader className="flex flex-col items-stretch border-b p-0 sm:flex-row">
          <div className="flex flex-1 flex-col justify-center gap-1 px-6 pt-4 pb-3 sm:py-0">
            <CardTitle>{cardHeader.title}</CardTitle>
            <CardDescription>{cardHeader.description}</CardDescription>
          </div>

          {/* Card Header - Insights */}
          <div className="flex">
            {infos?.map((key: string) => {
              const chart = key as keyof typeof config as string;
              return (
                <button
                  key={chart}
                  data-active={activeChart === chart}
                  className="data-[active=true]:bg-muted/50 relative z-30 flex flex-1 flex-col
                    justify-center gap-1 border-t px-6 py-4 text-left even:border-l sm:border-t-0
                    sm:border-l sm:px-8 sm:py-6"
                  onClick={() => setActiveChart(chart)}
                >
                  <span className="text-muted-foreground text-xs">
                    {config[chart].label}
                  </span>
                  {total !== null && (
                    <span className="text-lg leading-none font-bold sm:text-3xl">
                      {total?.[key as unknown as keyof typeof total]}
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </CardHeader>
  );
};

export const ChartSkeleton = () => {
  return <Card className="flex relative h-full">
      <CardHeader className="flex h-1/3">
        <Skeleton className="w-2/3 h-full"/>
        <Skeleton className="w-1/3 h-full"/>
      </CardHeader>
      <CardContent className="px-6 w-full h-full">
        <Skeleton className="relative h-full flex">
        <p className="absolute mt-[15%] mx-[32%] text-gray-400">
          Awaiting for chart data ...
        </p>
          </Skeleton>
        
      </CardContent>
  </Card>
}