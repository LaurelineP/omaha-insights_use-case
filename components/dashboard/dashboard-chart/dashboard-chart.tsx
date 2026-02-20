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
import type { StatData } from "@/types/data.types";

/**
 * Insight Chart Card - chart component within a card that can be a line or bar chart
 *  - `type` historical: displays a line chart
 *  - `type` latest: displays a bar chart
 *  UI rel.: Card / recharts chart ( LineChart + Line / BarChart + Bar )
 */
export function InsightChart<IChartData>({
  data,
  config,
  cardHeader,
  XAxisKey,
  YAxisKey,
  tooltipLabelFormatter,
  type,
}: ChartProps<IChartData>) {
  const [activeChart, setActiveChart] = useState<keyof typeof config>(
    cardHeader?.views[0] || ""
  );
  const [selectedCellIndex, setSelectedCellIndex] = useState<number | null>(null);
  const { Shape, ShapeChart } = getChartCoumpounds(type);

  const shouldSetHeader = cardHeader && data; // TODO: checks to satisfy expectation

  const isHistorical = type === "historical";
  const isLatest = type === "latest";

  const handleCellClick = (data: any, index: number) => {
    setSelectedCellIndex(selectedCellIndex === index ? null : index);
    console.log("Cell clicked:", { data, index });
  };

  const getCellColor = (index: number, defaultColor: string) => {
    return selectedCellIndex === index ? "#ef4444" : defaultColor;
  };

  return (
    <Card className="py-0">
      {/* Card Header - Graph Insights Info */}
      {shouldSetHeader && (
        <ChartCardHeader
          {...{ activeChart, setActiveChart, cardHeader, config, data }}
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
            <Shape dataKey={activeChart} radius={4} type="natural"/>
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
} & ChartProps<StatData>) => {
  /** Total Insights - total value per view */
  const infos = cardHeader?.views || null;
  const total = useMemo(() => {
    const shouldCreateTotal = infos?.length && data?.length;
    return shouldCreateTotal ? getSumDetailsByKeys(data, infos) : null;
  }, [data, infos]);

  if (!data) return null;

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

/** Chart's components resolver - Decides what chart components to use based on `type`
 * Based on `type`, this decides which components corresponds to it
 * Handles 2 type of chart - bar and line
 */
const getChartCoumpounds = (type: "historical" | "latest") => {
  const compounds = {
    historical: {
      Shape: Line,
      ShapeChart: LineChart,
    },
    latest: {
      Shape: Bar,
      ShapeChart: BarChart,
    },
  };

  if (!compounds[type]) {
    throw Error(
      'Unknown type of chart. The value should be "historical" or "latest".'
    );
  }

  const componentsToUse = compounds[type];
  return componentsToUse;
};
