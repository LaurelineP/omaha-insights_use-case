
import { DashboadData } from "@/types/data.types"
import { computeChartData } from "./dashboard-chart/dashboard-chart.utils"
import { TrendingUp, BarChart3, Target } from "lucide-react"
/* -------------------------------------------------------------------------- *
 *                 * Business Features decisions code related                 *
 * -------------------------------------------------------------------------- *
 *      Represents known key points and data to consume for the 
 *      Metric View Dashboard 
 *      ( list of metric to visualize, constants to use, maps, texts... )
 * 
 * ------------------------------------ - -----------------------------------
 *  1️⃣ Patterns to know
 *  - Decision on data recognition: Combining <metric>__<time scope>
 *  - Uses "__" separator to build or split the metrics
 * 
 * 
 *  2️⃣ Metric Selection possibilities - based on time scope:
 *  - "latest" focusing on last year data for a company
 *  - "historical" focusing on entries per year
 *       1. RAGR__historical
 *       2. RAGR__latest
 *       3. economic_profit__historical
 *       4. economic_profit__latest
 *       5. rcr_perc_harm__historical
 *       6. rcr_perc_harm__latest
 */

export type MetricKey =
    | "RAGR"
    | "economic_profit"
    | "rcr_perc_harm";

export type MetricType =
    | 'historical'
    | 'latest'

export type CategoryKey =
    | 'company_id'
    | 'fiscal_year'

export type OperationType =
    | 'average'
    | 'latest'

export type FieldKey = CategoryKey | MetricKey


/** View Option: representative string of view selection
 * - composed of both data property key and the type of view
  */
export type ChartViewOption = `${MetricKey}__${MetricType}` | ''

const modeToOperation: {
    [ key in MetricType ]: OperationType
} = {
    latest: 'latest',
    historical: 'average'
}

export const configSelectionOptions: ChartViewOption[] = [
    "RAGR__historical",
    "RAGR__latest",
    "economic_profit__historical",
    "economic_profit__latest",
    "rcr_perc_harm__historical",
    "rcr_perc_harm__latest",
]

export const keyToLabel = {
    RAGR: "Risk-Adjusted Growth Rate",
    economic_profit: "Economic Profit",
    rcr_perc_harm: "Risk Contribution Ratio (harm %)"
}

/** Icon mapping for each metric - stores icon component references */
export const metricIconMap: Record<MetricKey, typeof TrendingUp> = {
    RAGR: TrendingUp,
    economic_profit: BarChart3,
    rcr_perc_harm: Target,
}

/** Text for business features */
export const metricTextMap: Record<Exclude<ChartViewOption, ''>, {
    chartTitle: string;
    chartDescription: string;
    insightTitle: string;
    chartTooltip: string;
}> = {
    RAGR__latest: {
        chartTitle: 'Risk-Adjusted Growth Rate',
        chartDescription: 'Latest Risk-Adjusted Growth Rate per company.',
        insightTitle: 'Avg. Annual Growth',
        chartTooltip: 'Latest Risk-Adjusted Growth',
    },
    RAGR__historical: {
        chartTitle: 'Risk-Adjusted Growth Rate',
        chartDescription: 'Total Historical Risk-Adjusted Growth Rate per year.',
        insightTitle: 'Growth Trend',
        chartTooltip: 'Historical Risk-Adjusted Growth',
    },
    rcr_perc_harm__latest: {
        chartTitle: 'Risk Contribution Ratio (harm %)',
        chartDescription: 'Latest Risk Contribution Ratio (harm %) per company.',
        insightTitle: 'Avg. Harm Contribution',
        chartTooltip: 'Latest Harm Contribution',
    },
    rcr_perc_harm__historical: {
        chartTitle: 'Risk Contribution Ratio (harm %)',
        chartDescription: 'Total Historical Risk Contribution Ratio (harm %) per year.',
        insightTitle: 'Harm Contribution Trend',
        chartTooltip: 'Historical Harm Contribution',
    },
    economic_profit__latest: {
        chartTitle: 'Economic Profit',
        chartDescription: 'Latest Economic Profit per company.',
        insightTitle: 'Total Economic Profit',
        chartTooltip: 'Latest Economic Profit',
    },
    economic_profit__historical: {
        chartTitle: 'Economic Profit',
        chartDescription: 'Total Historical Economic Profit per year.',
        insightTitle: 'Economic Profit Trend',
        chartTooltip: 'Historical Economic Profit',
    },
}

/**
 * Get chart data for the selected views. 
 * @param data : app data { companies, stats }
 * @param selectedOptions : list of selected view options
 * @returns Data for charts
 */
export const getChartsSelection = (data: DashboadData, selectedOptions: ChartViewOption[]) => {
    return selectedOptions.map(selectedOption => {
        if (!selectedOption) return null

        const [property, mode] = selectedOption.split('__') as [FieldKey, MetricType]
        const _orderingKey: CategoryKey = mode === 'historical' ? 'fiscal_year' : 'company_id'

        return computeChartData(
            data,
            _orderingKey,
            property || '',
            modeToOperation[mode] || ''
        )
    })
}

export const configSelectionMap = [
    { metric: 'RAGR', type: 'latest' },
    { metric: 'RAGR', type: 'historical' },
    { metric: 'economic_profit', type: 'latest' },
    { metric: 'economic_profit', type: 'historical' },
    { metric: 'rcr_perc_harm', type: 'latest' },
    { metric: 'rcr_perc_harm', type: 'historical' },
] as const

export const COMPANY_COLORS: Record<number, string> = {
    1860: "#DCDDE1", // Apple
    1861: "#FFD19A", // Amazon
    1862: "#A6C8FB", // Meta
    1863: "#A8D8F5", // Microsoft
    1864: "#FDE9A0", // Google
    1865: "#F8B4B4", // Tesla
    1866: "#C6E896", // Nvidia
    1867: "#A6D4F5", // Intel
    1868: "#F8B5B8", // AMD
    1869: "#B5C4F8", // Qualcomm
    1870: "#B0BAF0", // Samsung
    1871: "#C2D4E8", // Sony
    1872: "#B8CBE0", // Sony
    1873: "#CCD9E8", // Sony
    1874: "#B5C8DC", // Sony
    1875: "#C8D5E4", // Sony
    1876: "#BCC8DC", // Sony
    1877: "#D0DBEA", // Sony
    1878: "#BAC5DC", // Sony
    1879: "#CDD8E8"  // Sony
};





const PERCENT_METRICS: MetricKey[] = ['rcr_perc_harm', 'RAGR']

export const formatMetricValue = (key: string, value: number): string => {
    if (PERCENT_METRICS.includes(key as MetricKey)) return `${(value * 100).toFixed(2)}%`
    return `~ ${Math.ceil(value)}`
}

export const metricDescription = {
    historical: 'Track metric trends over years to identify patterns, growth, and changes.\n* Ordered chronologically by fiscal year.',
    latest: 'Compare current metric values across companies to identify leaders and outliers.\n* Ordered by performance from highest to lowest.',
}