"use client";
import { ChartBarHorizontal } from "@/components/dashboard/barchart-example";
import { DashboardChart } from "@/components/dashboard/dashboard-chart";
import { InsightChart } from "@/components/dashboard/dashboard-chart copy";
import { chartConfig, chartData } from "@/components/dashboard/dashboard-chart.data";
import { createChartConfig, computeChartData } from "@/components/dashboard/dashboard-chart.utils";
import { DashboadData } from "@/types/data.types";
import { useEffect, useState } from "react";

export default function Dashboard() {
  const [data, setData] = useState<DashboadData | null>(null);

  useEffect(() => {
    fetch("/data.json")
      .then((res) => res.json())
      .then(setData);
  }, []);




  
  // data?.stats && groupBy(data?.stats, "company_id")

  //  const chartProps = {
  //   data: chartData,
  //   config: chartConfig,
  //   cardHeader: {
  //     views: ['desktop', 'mobile'],
  //     title: 'Bar Chart - Interactive',
  //     description: 'Showing total visitors for the last 3 months'
  //   },
  //   XAxisKey: 'date',
  //   type: 'historical'
  // }

  // const chartPropsOwn = {
  //   data: data && computeChartData(data, 'fiscal_year', 'RAGR', 'average') || [],
  //   config:  createChartConfig(['fiscal_year', 'RAGR'], "All RAGR average"),
  //   cardHeader: {
  //     views: ['RAGR'],
  //     title: 'RAGR Evolution',
  //     description: 'Showing total visitors for the last 3 months'
  //   },
  //   XAxisKey: 'fiscal_year',
  //   type: 'lala'
  // }

  // const chartPropsOwnBar = {
  // //  const RAGRresult = computeChartData( _data_, 'company_id', 'RAGR', 'latest' )
  //   data: data && computeChartData(data, 'company_id', 'RAGR', 'latest') || [],
  //   config:  createChartConfig(['company_id', 'RAGR'], "Latest values"),
  //   cardHeader: {
  //     views: ['RAGR'],
  //     title: 'RAGR Evolution',
  //     description: 'Showing total visitors for the last 3 months'
  //   },
  //   XAxisKey: 'company_id',
  //   type: 'latest'
  // }

  const chartPropsOwnBar = {
    type: 'latest',
    XAxisKey: 'RAGR', // ← company on x-axis
    YAxisKey: 'company_id', // ← company on x-axis
    data: data ? computeChartData(data, 'company_id', 'RAGR', 'latest').sort((a,b) => b['RAGR'] - a['RAGR'] ) : [],
    config: createChartConfig(['company_id', 'RAGR'], "Latest RAGR per company"),
    cardHeader: {
      views: ['RAGR'],
      title: 'RAGR Snapshot',
      description: 'Showing latest RAGR per company'
    },
  }

  // console.log('chartPropsOwn', chartPropsOwn)
  return (
    <div
      id="Dashboard"
      className="h-full w-full bg-slate-100 flex flex-col justify-center gap-4 px-6"
    >
      {/* <div className="w-full">
        <DashboardChart />
      </div>
      <div className="w-full grid grid-cols-1 md:grid-cols-2 gap-4">
        <DashboardChart />
        <DashboardChart />
      </div> */}
      <>
        {/* <InsightChart {...chartProps}/> */}
        {/* <InsightChart {...chartPropsOwn}/> { /* line */} 
        <InsightChart {...chartPropsOwnBar}/>  { /* Bar */}
        <ChartBarHorizontal />
      </>
     
    </div>
  );
}
