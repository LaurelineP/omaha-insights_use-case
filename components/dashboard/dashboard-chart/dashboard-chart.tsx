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
import { cn } from "@/lib/utils";

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
    size = "default",
  } = props;

  const ShapeChart = type === "historical" ? LineChart : BarChart;
  const isHistorical = type === "historical";
  const isLatest = type === "latest";

  const shouldSetHeader = cardHeader && data?.length;
  const isCompact = size === "compact";
  const cardHeightClass = isCompact
    ? "h-120 md:min-h-0 md:h-full"
    : "h-136 md:min-h-0 md:h-full";
  const chartBodyHeightClass = isCompact
    ? "flex-1 min-h-0"
    : "flex-1 min-h-0";

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
    <Card className={cn("py-0 w-full gap-0 overflow-hidden", cardHeightClass, "md:min-h-0")}>

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
      <CardContent className={cn(
        "px-2 sm:p-6 flex",
        chartBodyHeightClass
      )}>
        <ChartContainer
          config={config}
          className={cn(
            "aspect-auto w-full h-full min-h-0",
            chartBodyHeightClass
          )}
        >
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
              <Bar dataKey={XAxisKey} radius={4} type="natural" activeBar minPointSize={2}>
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
    <ChartSkeleton size={size} />
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
  const computorKey: string | undefined = cardHeader?.views?.[0];
  const total = useMemo(() => {
    if (!computorKey || !data?.length) return null;
    return getMetricDetailsByKeys(data as Record<string, any>[], [computorKey]);
  }, [data, computorKey]);

  const displayValue = total && computorKey
    ? (valueFormatter
        ? valueFormatter(total[computorKey as keyof typeof total] as number)
        : formatMetricValue(computorKey, total[computorKey as keyof typeof total] as number))
    : null;

  const displayDescription = type === 'latest' && lastYear 
    ? `${cardHeader.description} (${lastYear})`
    : cardHeader.description;

  return (
    <CardHeader className="flex flex-col items-stretch border-b p-0! h-40 overflow-hidden sm:h-auto sm:flex-row">
      <div className="flex flex-1 h-full min-w-0 items-center gap-4 px-8 pt-5 pb-4 sm:px-6 sm:py-0">
        <div className="hidden sm:flex items-center justify-center shrink-0 text-primary text-2xl">
          {icon}
        </div>
        <div className="flex flex-col justify-center min-w-0">
          <CardTitle className="truncate text-gray-800">
            {cardHeader.title}
          </CardTitle>
          <CardDescription className="line-clamp-2">
            {displayDescription}
          </CardDescription>
        </div>
      </div>

      {/* Card Header - Metric total */}
      {computorKey && (
        <div className={cn("flex sm:w-24 md:w-28 lg:w-32 xl:w-36 min-w-0 self-stretch flex-col justify-center",
          "gap-1 border-t sm:border-t-0 sm:border-l sm:px-4 sm:py-6 w-full h-full flex-1 sm:flex-none items-center px-4 py-1.5"
        )}>
          <span className="text-muted-foreground text-xs w-full text-center leading-tight line-clamp-2">
            {cardHeader.insightLabel}
          </span>
          {!!total && (
            <span className="leading-tight font-bold text-lg sm:text-xl w-full text-center truncate text-primary">
              {displayValue}
            </span>
          )}
        </div>
      )}
    </CardHeader>
  );
};

/** Skeleton for chart card when no data are available*/
export const ChartSkeleton = ({
  size = "default",
}: {
  size?: "default" | "compact";
}) => {
  const isCompact = size === "compact";
  const skeletonCardHeightClass = isCompact
    ? "h-120 md:min-h-0 md:h-full"
    : "h-136 md:min-h-0 md:h-full";
  const skeletonBodyHeightClass = isCompact
    ? "flex-1 min-h-0"
    : "flex-1 min-h-0";

  return (
    <Card className={cn("py-0 w-full md:h-full md:min-h-0 bg-gray-50 gap-0 overflow-hidden", skeletonCardHeightClass)}>
      <div className="flex flex-col items-stretch border-b h-40 overflow-hidden sm:h-auto sm:flex-row">
        <div className="flex flex-1 h-full flex-col justify-center gap-2 px-8 pt-5 pb-4 sm:px-6 sm:py-0">
          <Skeleton className={cn("h-5", isCompact ? "w-28 md:w-24 lg:w-32" : "w-32")} />
          <Skeleton className={cn("h-3.5", isCompact ? "w-40 md:w-36 lg:w-52" : "w-52")} />
        </div>
        <div className={cn(
          "flex sm:w-24 md:w-28 lg:w-32 xl:w-36 min-w-0 self-stretch flex-col justify-center gap-2 border-t sm:border-t-0 sm:border-l sm:px-4 sm:py-6 w-full h-full flex-1 sm:flex-none items-center py-2",
          isCompact ? "px-5" : "px-4"
        )}>
          <Skeleton className={cn("h-2.5 max-w-full", isCompact ? "w-[58%]" : "w-[68%]")} />
          <Skeleton className={cn("h-5 max-w-full", isCompact ? "w-[70%]" : "w-[82%]")} />
        </div>
      </div>

      <CardContent className={cn("px-2 py-2 sm:p-6 flex", skeletonBodyHeightClass)}>
        <Skeleton className="text-sm text-gray-400 h-full w-full">
          <div className="flex flex-col items-center justify-center h-full text-center px-8">
            <Plug2Icon strokeWidth={1.4} className="animate-bounce"/>
            <span>Select a metric to display the chart</span>
          </div>
        </Skeleton>
      </CardContent>
    </Card>
  );
};
