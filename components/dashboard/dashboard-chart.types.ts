import { ChartConfig } from "@/components/ui/chart";

export interface InsightChartHeader {
  views: string[], // list of view to diplay for a chart
  title: string,
  description: string
}

export interface InsightChart<TDataItem> {
  data: TDataItem[];
  type: 'historical' | 'latest',
  header?: InsightChartHeader,
  tooltipConfig: ChartConfig,
  XAxisKey: keyof TDataItem,
  YAxisKey: keyof TDataItem,
}


export interface ChartProps<TDataItem> {
  data: TDataItem[];
  config: ChartConfig;
  cardHeader?: InsightChartHeader;
  XAxisKey: string;
  YAxisKey: string;
  type: 'historical' | 'latest'
};


export interface IChartData {
  [dataKey: string]: string | number | boolean | Date
}