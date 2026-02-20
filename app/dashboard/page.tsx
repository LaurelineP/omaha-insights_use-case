
/**
 * @fileoverview Dashboard page component
 * Uses 'any' for payload types to align with Recharts library APIs without modification.
 */
/* eslint-disable @typescript-eslint/no-explicit-any */

"use client"
import { InsightChart } from "@/components/dashboard/dashboard-chart/dashboard-chart";
import { createChartConfig } from "@/components/dashboard/dashboard-chart/dashboard-chart.utils";
import { CategoryKey, chartDescriptionOptions, ChartViewOption, getChartsSelection, MetricKey, MetricType, tooltipDescriptions } from "@/components/dashboard/dashboard-features";
import { DashboardContext } from "@/context/dashboard.context";
import { DashboadData } from "@/types/data.types";
import { useContext, useEffect, useMemo, useState } from "react";
import { Payload } from "recharts/types/component/DefaultLegendContent";

export default function Dashboard() {
  const [data, setData] = useState<DashboadData | null>(null);
  const { selectedCharts } = useContext(DashboardContext)
  console.log('view main selectedCharts:', selectedCharts)
  // const [ chartsSeletion ] = useState<ChartViewOption[]>(
  //   ['RAGR__latest', 'economic_profit__historical', 'rcr_perc_harm__historical' ]
  // )
  useEffect(() => {
    fetch("/data.json")
      .then((res) => res.json())
      .then(setData);
  }, []);

  // Data formated for chart
  const selectedChartData = useMemo(() => {
      if(!data) return []
        const values = getChartsSelection(data, selectedCharts)
        return values
    }, [data, selectedCharts])



  const formatLatestTooltipLabel = (value: string | number, payload: Payload | Payload[]) => {
    const chartRow = Array.isArray(payload) ? payload?.[0] : payload
    if (!chartRow?.payload) return null;

    const row     = chartRow.payload as Record<string, any>
    const xKey    = chartRow.dataKey as MetricKey
    const yKey    = Object.keys(row).find( k => k !== xKey ) as CategoryKey | undefined
    const yValue  = yKey ? row?.[yKey] : undefined
    const company = yValue ? data?.companies.find( c => (c as Record<string, any>)?.[yKey!] === yValue ) : undefined


    return (
      <div className="flex items-center gap-2">
        <p className="text-sm">{company?.name || ''}</p>
        <span className="align-center text-xs italic text-gray-400">#{yValue}</span>
      </div>
    )
  }


  const formatHistoricalTooltipLabel = (value: string | number, payload: Payload | Payload[]) => {
    const chartRow = Array.isArray(payload) ? payload?.[0] : payload
    if (!chartRow?.payload) return null;

    const row   = chartRow.payload as Record<string, any>
    const xKey  = chartRow.dataKey
    const yKey  = Object.keys(row).find( k => k !== xKey )
    return yKey ? `Year ${row[yKey]}` : ''
  }

  const createInsightChartProps = (type: MetricType | 'latest', XAxisKey: MetricKey, YAxisKey: CategoryKey, data: Record<string, any>[] ) => {
    const isLatest = type === 'latest'
    const isHistorical = type === 'historical'
    const tooltipLabelFormatter = isLatest ? formatLatestTooltipLabel : isHistorical ? formatHistoricalTooltipLabel : undefined
    
    const cardTitleType = isLatest ? 'Snapshot' : 'Historical'
    const cardTitle = isLatest && `${ XAxisKey } ${cardTitleType}` || isHistorical && `${cardTitleType} ${XAxisKey}` || ''
  
    const selectedKey: ChartViewOption = `${XAxisKey}__${type}`
    const chartConfigArgs = [XAxisKey, YAxisKey];

    return {
      data,
      type,
      XAxisKey,
      YAxisKey,
      tooltipLabelFormatter,
      cardHeader: {
        views: [XAxisKey],
        title: <p className="capitalize">{cardTitle.replaceAll('_', ' ')}</p>,
        description: chartDescriptionOptions[ selectedKey ]
      },
      config: createChartConfig(chartConfigArgs, tooltipDescriptions[selectedKey]),
    }
  }

  const [ chartOne, chartTwo, chartThree ] = selectedCharts.map((chartOption: ChartViewOption, idx) => {
    if(!chartOption) return {}
    const [ metric, mode ] = chartOption.split('__') as [MetricKey, MetricType]
    const YAxisKey: CategoryKey = mode === "historical" ? 'fiscal_year' : 'company_id'
    return createInsightChartProps(mode, metric as MetricKey, YAxisKey, selectedChartData?.[idx])
  })

  return (
    <div id="Dashboard"
      className="h-full w-full bg-slate-100 flex flex-col justify-center gap-4 px-6"
    >
        <div className="w-full">
          <InsightChart {...chartOne} />
        </div>
        <div className="w-full grid grid-cols-1 md:grid-cols-2 gap-4">
          <InsightChart {...chartTwo} />
          {/* <InsightChart {...chartThree} /> */}
          <InsightChart />
        </div>
    </div>
  )
}