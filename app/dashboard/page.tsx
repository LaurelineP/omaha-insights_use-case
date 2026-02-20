
"use client"
import { InsightChart } from "@/components/dashboard/dashboard-chart/dashboard-chart";
import { createChartConfig } from "@/components/dashboard/dashboard-chart/dashboard-chart.utils";
import { CategoryKey, chartDescriptionOptions, ChartViewOption, FieldKey, getChartsSelection, MetricKey, MetricType, tooltipDescriptions } from "@/components/dashboard/dashboard-features";
import { DashboadData } from "@/types/data.types";
import { useEffect, useMemo, useState } from "react";
import { Payload } from "recharts/types/component/DefaultLegendContent";

export default function Dashboard() {
  const [data, setData] = useState<DashboadData | null>(null);
  const [ chartsSeletion, setChartSelection ] = useState<ChartViewOption[]>(
    ['RAGR__latest', 'economic_profit__historical', 'rcr_perc_harm__historical' ]
  )
  useEffect(() => {
    fetch("/data.json")
      .then((res) => res.json())
      .then(setData);
  }, []);

  // Data formated for chart
  const selectedChartData = useMemo(() => {
      if(!data) return []
        const values = getChartsSelection(data, chartsSeletion)
        return values
    }, [data, chartsSeletion])



  const formatLatestTooltipLabel = (value: string | number, payload: Payload[]) => {
    const chartRow = payload?.[0]
    if (!chartRow) return null;

    const row     = chartRow.payload
    const xKey    = chartRow.dataKey as MetricKey
    const yKey    = Object.keys(row).find( k => k !== xKey ) as CategoryKey
    const yValue  = row[ yKey ]
    const company = data?.companies.find( c => c[ yKey ] === yValue )
    
    
    return (
      <div className="flex items-center gap-2">
        <p className="text-sm">{company?.name || ''}</p>
        <span className="align-center text-xs italic text-gray-400">#{yValue}</span>
      </div>
    )
  }


  const formatHistoricalTooltipLabel = (value: string | number, payload: Record<string, any>) => {
    const chartRow = payload?.[0]
    if (!chartRow) return null;

    const row   = chartRow.payload
    const xKey  = chartRow.dataKey
    const yKey  = Object.keys(row).find( k => k !== xKey )
    return `Year ${row[yKey]}`
  }

  const createInsightChartProps = (type: MetricType | 'latest', XAxisKey: MetricKey, YAxisKey: CategoryKey, data ) => {
    const isLatest = type === 'latest'
    const isHistorical = type === 'historical'
    const tooltipLabelFormatter = isLatest && formatLatestTooltipLabel || isHistorical && formatHistoricalTooltipLabel
    
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

  const [ chartOne, chartTwo, chartThree ] = chartsSeletion.map((chartOption: ChartViewOption, idx) => {
    const [ metric, mode ] = chartOption.split('__')
    const YAxisKey = mode === "historical" ? 'fiscal_year' : 'company_id' as MetricType
    return createInsightChartProps(mode, metric, YAxisKey, selectedChartData?.[idx])
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
          <InsightChart {...chartThree} />
        </div>
    </div>
  )
}