/**
 * @fileoverview Insight Chart Component
 * Uses 'any' for chart configuration and data to align with UI library requirements.
 */
/* eslint-disable @typescript-eslint/no-explicit-any */

"use client";
import { Plug2Icon } from "lucide-react";

import { useMemo } from "react";
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
  Legend,
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

import { getMetricDetailsByKeys } from "./dashboard-chart.utils";
import { ChartProps } from "./dashboard-chart.types";
import { COMPANY_COLORS, formatMetricValue } from "@/components/dashboard/dashboard-features";
import { Skeleton } from "@/components/ui/skeleton";

/**
 * Insight Chart Card - chart component within a card that can be a line or bar chart
 *  - `type` historical: displays a line chart
 *  - `type` latest: displays a bar chart
 *  UI rel.: Card / recharts chart ( LineChart + Line / BarChart + Bar )
 */
export function DashboardChart<T extends Record<string, unknown>>(
  props: ChartProps<T>
) {
  const {
    data,
    config,
    cardHeader,
    XAxisKey,
    YAxisKey,
    type,
    tooltipLabelFormatter,
    valueFormatter,
    icon,
  } = props;

  const ShapeChart = type === "historical" ? LineChart : BarChart;
  const isHistorical = type === "historical";
  const isLatest = type === "latest";

  const shouldSetHeader = cardHeader && data?.length;
  
  // Extract last year from data for bar charts
  const lastYear = useMemo(() => {
    if (!isLatest || !data?.length) return null;
    const years = data
      .map((item) => (item as any).fiscal_year)
      .filter((year): year is number => typeof year === "number");
    return years.length > 0 ? Math.max(...years) : null;
  }, [data, isLatest]);

  const getCellColor = (entry: Record<string, unknown>) => {
    const companyId = entry[YAxisKey] as number;
    return COMPANY_COLORS[companyId] ?? config?.[XAxisKey]?.color ?? "#000000";
  };

  return data?.length ? (
    <Card className="py-0 h-full">

      {/* Card Header - Graph Insights Info */}
      {shouldSetHeader && (
        <ChartCardHeader
          cardHeader={cardHeader}
          config={config}
          data={data}
          valueFormatter={valueFormatter}
          icon={icon}
          type={type}
          lastYear={lastYear}
        />
      )}

      {/* Card Content - Graph */}
      <CardContent className="px-2 sm:p-6 flex flex-1 min-h-0 overflow-hidden">
        <ChartContainer config={config} className="aspect-auto w-full">
          <ShapeChart
            className="h-full"
            accessibilityLayer
            data={data}
            margin={{ top: 12, bottom: 12, left: 20, right: 20 }}
            {...(type === "latest" && { layout: "vertical" })}
          >
            <CartesianGrid vertical={false} strokeDasharray="3 3" />
            {/* -------------------------------------------------------------------------- */
            /*                        Line Chart - Axes Controller                        */
            /* -------------------------------------------------------------------------- */}
            {isHistorical && <XAxis dataKey={YAxisKey} interval={Math.ceil(data.length / 5) - 1} />}
            {isHistorical && <YAxis hide />}

            {/* -------------------------------------------------------------------------- */
            /*                   Horizontal Bar Chart - Axes Controllers                  */
            /* -------------------------------------------------------------------------- */}

            {isLatest && (<ReferenceLine x={0} stroke="#6366f1" isFront={true}/> )}
            {isLatest && <XAxis type="number" dataKey={XAxisKey} hide />}
            {isLatest && <YAxis type="category" dataKey={YAxisKey} hide />}

            {/* ------------------------------------ - ----------------------------------- */}
            <ChartTooltip
              content={
                <ChartTooltipContent
                  className="w-40"
                  {...(tooltipLabelFormatter && { labelFormatter: tooltipLabelFormatter })}
                  {...(valueFormatter && { formatter: (value) => valueFormatter(value as number) })}
                />
              }
            />
            {/* -------------------------------------------------------------------------- */
            /*                    Line Chart - Graph Vector Controller                    */
            /* -------------------------------------------------------------------------- */}
            {isHistorical && (
              <Line dataKey={XAxisKey} radius={4} type="natural" stroke="#6366f1" strokeWidth={1} /> 
            )}

            {/* -------------------------------------------------------------------------- */
            /*                     Bar Chart - Graph Vector Controller                    */
            /* -------------------------------------------------------------------------- */}
            {isLatest && (
              <Bar dataKey={XAxisKey} radius={4} type="natural" activeBar >
                {data?.map(
                  (entry: Record<string, unknown>, index: number) => (
                      <Cell
                        key       = {`cell-${ index }`}
                        fill      = { getCellColor( entry )}
                        className ="opacity-70"
                      />
                    )
                )}
              </Bar>
            )}
            <Legend />
          </ShapeChart>
        </ChartContainer>
      </CardContent>

    </Card>
  ) : (
    <ChartSkeleton />
  );
}

/** ChartCardHeader - Displays chart title, description, and the single metric total */
export const ChartCardHeader = ({
  cardHeader,
  data,
  valueFormatter,
  icon,
  type,
  lastYear,
}: {
  cardHeader?: any;
  data?: any[];
  config?: any;
  valueFormatter?: (value: number) => string;
  icon?: React.ReactNode;
  type?: string;
  lastYear?: number | null;
}) => {
  const key: string | undefined = cardHeader?.views?.[0];
  const total = useMemo(() => {
    if (!key || !data?.length) return null;
    return getMetricDetailsByKeys(data as Record<string, any>[], [key]);
  }, [data, key]);

  const displayValue = total && key
    ? (valueFormatter
        ? valueFormatter(total[key as keyof typeof total] as number)
        : formatMetricValue(key, total[key as keyof typeof total] as number))
    : null;

  const displayDescription = type === 'latest' && lastYear 
    ? `${cardHeader.description} (${lastYear})`
    : cardHeader.description;

  return (
    <CardHeader className="flex flex-col items-stretch border-b p-0! sm:flex-row max-h-23 overflow-hidden">
      <div className="flex flex-1 min-w-0 items-center gap-4 px-6 pt-4 pb-3 sm:py-0">
        <div className="hidden sm:flex items-center justify-center shrink-0 text-primary text-2xl">
          {icon}
        </div>
        <div className="flex flex-col justify-center min-w-0">
          <CardTitle className="truncate text-gray-800">{cardHeader.title}</CardTitle>
          <CardDescription className="line-clamp-2">{displayDescription}</CardDescription>
        </div>
      </div>

      {/* Card Header - Metric total */}
      {key && (
        <div className="flex w-37.5 flex-col justify-center gap-1 overflow-hidden border-t sm:border-t-0 sm:border-l sm:px-4 sm:py-6">
          <span className="text-muted-foreground text-xs text-wrap">
            {cardHeader.insightLabel}
          </span>
          {total !== null && (
            <span className="leading-none font-bold text-xl text-wrap text-primary">
              {displayValue}
            </span>
          )}
        </div>
      )}
    </CardHeader>
  );
};

/** Skeleton for chart card when no data are available*/
export const ChartSkeleton = () => {
  return (
    <Card className="h-full bg-gray-50 p-0 m-0 gap-0 overflow-hidden">
      <div className="flex flex-row items-stretch border-b max-h-23">
        <div className="flex flex-1 flex-col justify-center gap-2 px-6 py-4">
          <Skeleton className="h-5 w-32" />
          <Skeleton className="h-3.5 w-52" />
        </div>
        <div className="flex w-37.5 flex-col justify-center gap-2 overflow-hidden border-l px-4 py-6">
          <Skeleton className="h-3 w-3/4" />
          <Skeleton className="h-6 w-full" />
        </div>
      </div>

      <Skeleton className="text-sm m-2 text-gray-400 h-full">
        <div className="flex flex-col items-center justify-center mt-[10vh] text-center px-8">
          <Plug2Icon strokeWidth={1.4} className="animate-bounce"/>
          <span>Select a metric to display the chart</span>
        </div>
      </Skeleton>
    </Card>
  );
};
