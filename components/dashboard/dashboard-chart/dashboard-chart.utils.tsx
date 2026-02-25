/**
 * @fileoverview Dashboard Chart Utilities
 * Computes and formats chart data for visualization.
 */

import { groupBy } from "@/lib/utils";

import type { ChartConfig } from "@/components/ui/chart";
import type { DashboadData } from "@/types/data.types";
import type { IChartData } from "./dashboard-chart.types";
import type { FieldKey } from "../dashboard-features";

const PERCENT_METRICS = ["rcr_perc_harm", "RAGR"];

/** Get metric details - averages percent metrics, sums others */
export function getMetricDetailsByKeys(data: IChartData[], views: string[]) {
  if (!views.length || !data?.length) return;

  const _views: Record<string, number> = {};

  for (const view of views) {
    let sum = 0;
    let count = 0;

    for (const dataItem of data) {
      if (typeof dataItem[view] === "number") {
        sum += dataItem[view];
        count++;
      }
    }

    // Average percent metrics, sum others
    const isPercentMetric = PERCENT_METRICS.includes(view);
    _views[view] = isPercentMetric && count > 0 ? sum / count : sum;
  }
  return _views;
}

export function getSumDetailsByKeys(data: IChartData[], views: string[]) {
  if (!views.length || !data?.length) return;

  /* Init Views details */
  const _views: Record<string, number> = {};

  /* Builds splitted views */
  for (const view of views) {
    for (const dataItem of data) {
      /* Sets property in _views */
      if (!_views.hasOwnProperty(view)) {
        _views[view] = 0;
      }

      /* Sums number value from data with the view key */
      if (typeof dataItem[view] === "number") {
        _views[view] += dataItem[view];
      }
    }
    _views[view] = Number(_views[view].toFixed(2));
  }
  return _views;
}

/** Compute App raw data to chart data (line or bar charts)
 * - groups and reshapes source data
 * - computes chart data base on selected options
 * @param data : raw data to process
 * @param orderingKey : grouping key to position items on the axis
 * @param computorKey : metric key used to compute data
 * @param operation   : aggregation mode to apply
 * @param agnosticKeys: optional keys expected to remain constant within each group
 */
export const computeChartData = ({ data, orderingKey, computorKey, operation, agnosticKeys }: {
  data: DashboadData,
  operation: "average" | "latest",
  orderingKey: FieldKey,
  computorKey: FieldKey,
  agnosticKeys?: FieldKey[]
}) => {
  let UIChartData: Array<Record<string, number | string>> = [];

  /* Groups per "orderingKey" */
  const groupedByOrderingKey = groupBy(data.stats, orderingKey);

  /* Per "orderingValue" (x axis key), loops to access the list of info */
  for (const [orderingValue, detailsList] of groupedByOrderingKey) {
    if (!detailsList?.length) {
      UIChartData.push({
        [orderingKey]: orderingValue,
      });
      continue;
    }

    /* From the info list, sums the values of `computorKey` (y axis key) */
    const summedValue = detailsList.reduce(
      (acc: number, curr: { [x: string]: number }) =>
        (acc += curr[computorKey] ?? 0),
      0
    );

    const operations = {
      average: detailsList.length ? summedValue / detailsList.length : 0,
      latest: detailsList.at(-1)[computorKey],
    };

    /* Formats to chart data */
    const UIChartDatum = {
      [orderingKey]: orderingValue,
      [computorKey]: operations[operation],
    };

    /* Adds extra chart data - invariant field from grouped data */
    if( agnosticKeys ){
      for(const agnosticKey of agnosticKeys ){
        UIChartDatum[agnosticKey] = detailsList.at(-1)[agnosticKey]
      }
    }
    UIChartData.push(UIChartDatum);
  }

  /* Orders by `computorKey` DESC */
  if (operation === "latest") {
    UIChartData = UIChartData.sort((a, b) => {
      if (
        typeof b[computorKey] === "number" &&
        typeof a[computorKey] === "number"
      ) {
        return b[computorKey] - a[computorKey];
      }
      return 0;
    });
  }
 return UIChartData;
};

export const createChartConfig = (
  infoList: string[],
  description: string
): ChartConfig => {
  const config: ChartConfig = {};
  for (const index in infoList) {
    const info = infoList[index];
    config[info] = {
      label: info.replaceAll(/[-_]/g, " "),
      color: "var(--chart-3)",
    }
  }
  config.views = { label: description };
  return config;
};
