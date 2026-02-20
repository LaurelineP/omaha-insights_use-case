"use client"

import { TrendingUp } from "lucide-react"
import { Bar, BarChart, ReferenceLine, XAxis, YAxis } from "recharts"

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart"

export const description = "A horizontal bar chart"

const chartData = [
//   { month: "January", desktop: 186 },
//   { month: "February", desktop: 305 },
//   { month: "March", desktop: 237 },
//   { month: "April", desktop: 73 },
//   { month: "May", desktop: 209 },
//   { month: "June", desktop: 214 },

    {
        "company_id": 1877,
        "RAGR": 0.45
    },
    {
        "company_id": 1875,
        "RAGR": 0.39
    },
    {
        "company_id": 1864,
        "RAGR": 0.3
    },
    {
        "company_id": 1870,
        "RAGR": 0.26
    },
    {
        "company_id": 1876,
        "RAGR": 0.24
    },
    {
        "company_id": 1869,
        "RAGR": 0.2
    },
    {
        "company_id": 1872,
        "RAGR": 0.19
    },
    {
        "company_id": 1878,
        "RAGR": 0.17
    },
    {
        "company_id": 1863,
        "RAGR": 0.15
    },
    {
        "company_id": 1866,
        "RAGR": 0.09
    },
    {
        "company_id": 1865,
        "RAGR": -0.01
    },
    {
        "company_id": 1867,
        "RAGR": -0.03
    },
    {
        "company_id": 1874,
        "RAGR": -0.03
    },
    {
        "company_id": 1861,
        "RAGR": -0.04
    },
    {
        "company_id": 1860,
        "RAGR": -0.05
    },
    {
        "company_id": 1871,
        "RAGR": -0.05
    },
    {
        "company_id": 1879,
        "RAGR": -0.05
    },
    {
        "company_id": 1862,
        "RAGR": -0.06
    },
    {
        "company_id": 1873,
        "RAGR": -0.08
    },
    {
        "company_id": 1868,
        "RAGR": -0.12
    }
]

const chartConfig = {
  desktop: {
    label: "Desktop",
    color: "var(--chart-1)",
  },
} satisfies ChartConfig

export function ChartBarHorizontal() {
  return (
    <Card>

      <CardHeader>
        <CardTitle>Bar Chart - Horizontal</CardTitle>
        <CardDescription>January - June 2024</CardDescription>
      </CardHeader>
      
      <CardContent>
        <ChartContainer config={chartConfig}>
          <BarChart
            accessibilityLayer
            data={chartData}
            layout="vertical"
            margin={{
              left: -20,
            }}
          >
            <ReferenceLine x={0} stroke="var(--muted-foreground)" />
            <XAxis type="number" dataKey="RAGR"/>
            <YAxis
              dataKey="company_id"
              type="category"
              tickLine={false}
              tickMargin={10}
              axisLine={false}
            //   tickFormatter={(value) => `${value}`.slice(0, 3)}
            />
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent hideLabel />}
            />
            <Bar dataKey="RAGR" fill="var(--color-desktop)" radius={5} />
          </BarChart>
        </ChartContainer>
      </CardContent>
      <CardFooter className="flex-col items-start gap-2 text-sm">
        <div className="flex gap-2 leading-none font-medium">
          Trending up by 5.2% this month <TrendingUp className="h-4 w-4" />
        </div>
        <div className="text-muted-foreground leading-none">
          Showing total visitors for the last 6 months
        </div>
      </CardFooter>
    </Card>
  )
}
