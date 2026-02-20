"use client"

import { useMemo, useState } from "react"
import { Bar, BarChart, CartesianGrid, XAxis, Line, LineChart, YAxis } from "recharts"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart"

import { getSumDetailsByKeys,  } from "./dashboard-chart.utils"
import { ChartProps } from "./dashboard-chart.types"



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
    type = 'historical'
  }: ChartProps<IChartData>) {
    const [ activeChart, setActiveChart ] = useState<keyof typeof config>(cardHeader?.views[0] || '')
    console.log('activeChart:', activeChart)
    const { Shape, ShapeChart } = getChartCoumpounds( type )

    const shouldSetHeader = cardHeader && data; // TODO: checks to satisfy expectation
  return (

    <Card className="py-0">

      {/* Card Header - Graph Insights Info */}
      { shouldSetHeader && (
        <ChartCardHeader {...{ activeChart, setActiveChart, cardHeader, config, data }} />
      )}

      {/* Card Content - Graph */}
      <CardContent className="px-2 sm:p-6">

        <ChartContainer
          config={config}
          className="aspect-auto h-62.5 w-full"
        >
          <ShapeChart
            accessibilityLayer
            data={ data }
            margin={{ left: 12, right: 12 }}
            {...( type === "latest" && { layout: "vertical" })}
          >
            <CartesianGrid vertical={false} />
            { type === 'historical' && (

              <XAxis
                dataKey       = { XAxisKey }
                tickLine      = { false }
                // axisLine      = { false }
                tickMargin    = { 8 }
                minTickGap    = { 32 }
                // tickFormatter = { value => {
                //   const date = new Date(value)
                //   return date.toLocaleDateString( window.navigator.language, {
                //     year: "numeric"
                //   })
                // }}
                
                />
            )}

            { type === 'latest' && (
              <>
              <XAxis type="number" dataKey={XAxisKey}  />
              <YAxis  dataKey={XAxisKey} />
              </>
            )}
            <ChartTooltip
              content={
                <ChartTooltipContent
                  className="w-37.5"
                  nameKey="views"
                  labelFormatter={(value, x) => {
                    console.log('x:', x)
                    return new Date(value).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                      year: "numeric",
                    })
                  }}
                />
              }
            />
            <Shape dataKey={activeChart} fill={`var(--color-${activeChart})`} radius={2} type="natural"/>
          </ShapeChart>
        </ChartContainer>

      </CardContent>
    </Card>
  )
}

/** ChartCardHeader - Displays chart infos with ability to set views based on total insights  */
export const ChartCardHeader = ({ activeChart, setActiveChart, cardHeader, data, config }) => {
  /** Total Insights - total value per view */
  const infos = cardHeader?.views || null
  const total = useMemo(
    () => {
      const shouldCreateTotal = infos?.length && data?.length 
      return shouldCreateTotal ? getSumDetailsByKeys(data, infos) : null
    },
    [data, infos]
  )

  if(!data) return null;



  return (
    <>
     {/* Card Header - Insights Description */}
      { cardHeader && (
        <CardHeader className="flex flex-col items-stretch border-b p-0 sm:flex-row">
          <div className="flex flex-1 flex-col justify-center gap-1 px-6 pt-4 pb-3 sm:py-0">
            <CardTitle>{ cardHeader.title }</CardTitle>
            <CardDescription>{ cardHeader.description }</CardDescription>
          </div>

          {/* Card Header - Insights */}
          <div className="flex">
            {
              infos?.map((key: number) => {
                const chart = key as keyof typeof config as string
                return (
                  <button
                    key={chart}
                    data-active={activeChart === chart}
                    className="data-[active=true]:bg-muted/50 relative z-30 flex flex-1 flex-col justify-center gap-1 border-t px-6 py-4 text-left even:border-l sm:border-t-0 sm:border-l sm:px-8 sm:py-6"
                    onClick={() => setActiveChart(chart)}
                  >
                    <span className="text-muted-foreground text-xs">
                      {config[chart].label}
                    </span>
                    { total !== null && (
                      <span className="text-lg leading-none font-bold sm:text-3xl">
                        {total?.[key as keyof typeof total] }
                      </span>
                    )}
                  </button>
                )
              })
            }
          </div>
      </CardHeader>
      )}
      </>
  )
}



/** Chart's components resolver - Decides what chart components to use based on `type`
 * Based on `type`, this decides which components corresponds to it
 * Handles 2 type of chart - bar and line
 */
const getChartCoumpounds = ( type: 'historical' | 'latest' ) => {
  const shapes =  {
    historical: Line,
    latest: Bar
  }

  const chartShapes = {
    historical: LineChart,
    latest: BarChart
  }

  const Shape = shapes[ type ]
  const ShapeChart = chartShapes[ type ]

  return { Shape, ShapeChart }
}