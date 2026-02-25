import { ChartConfig } from "@/components/ui/chart";
import { ReactNode } from "react";

export interface InsightChartHeader {
  views: string[], // list of view to diplay for a chart
  title: string | ReactNode,
  description: string
}

export interface DashboardChart<TDataItem> {
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
  tooltipLabelFormatter?: (label: unknown, payload: unknown[]) => ReactNode;
  valueFormatter?: (value: number) => string;
  type: 'historical' | 'latest';
  icon?: ReactNode;
  size?: 'default' | 'compact';
};


export interface IChartData {
  [dataKey: string]: string | number | boolean | Date
}