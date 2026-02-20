
import { DashboadData } from "@/types/data.types"
import { computeChartData } from "./dashboard-chart/dashboard-chart.utils"


// Possibilities Selection
/**
 * 1. RAGR__historical
 * 2. RAGR__latest
 * 3. economic_profit__historical
 * 4. economic_profit__latest
 * 5. rcr_perc_harm__historical
 * 6. rcr_perc_harm__latest
 */
export type CategoryKey = 
    | 'company_id'
    | 'fiscal_year'

export type MetricKey =
    | "RAGR"
    | "economic_profit"
    | "rcr_perc_harm";

export type MetricType = 
    | 'historical'
    | 'latest' 

export type OperationType =
    | 'average'
    | 'latest'

export type FieldKey = CategoryKey | MetricKey


/** View Option: representative string of view selection
 * - composed of both data property key and the type of view
  */
export type ChartViewOption = `${MetricKey}__${MetricType}`

const modeToOperation: {
    [ key in MetricType ]: OperationType
} = {
    latest: 'latest',
    historical: 'average'
}

export const keyToLabel = {
  RAGR: "Risk-Adjusted Growth Rate",
  economic_profit: "Economic Profit",
  rcr_perc_harm: "Risk Contribution Ratio (harm %)"
}

export const chartDescriptionOptions: Record<ChartViewOption, string> = {
    RAGR__historical : "Total Historical Risk-Adjusted Growth Rate per year.",
    RAGR__latest : "Latest Risk-Adjusted Growth Rate per company.",

    economic_profit__historical : "Total Historical Economic Profit per year.",
    economic_profit__latest : "Latest Economic Profit per company.",

    rcr_perc_harm__historical : "Total Historical Risk Contribution Ratio (harm %) per year.",
    rcr_perc_harm__latest : "Latest Risk Contribution Ratio (harm %) per company."
}

export const tooltipDescriptions = {
  RAGR__latest: "Latest Risk-Adjusted Growth",
  RAGR__historical: "Historical Risk-Adjusted Growth",

  economic_profit__latest: "Latest Economic Profit",
  economic_profit__historical: "Historical Economic Profit",

  rcr_perc_harm__latest: "Latest Harm Contribution",
  rcr_perc_harm__historical: "Historical Harm Contribution"
};




/**
 * Get chart data for the selected views. 
 * @param data : app data { companies, stats }
 * @param selectedOptions : list of selected view options
 * @returns Data for charts
 */
export const getChartsSelection = (data: DashboadData, selectedOptions: ChartViewOption[]) => {
    const selectionParams = []
    for( const selectedOption of selectedOptions){
        const [ property, mode ] = selectedOption.split('__') as [ FieldKey, MetricType ]

        const _orderingKey: CategoryKey | null = mode === 'historical' && 'fiscal_year' || mode === 'latest'&& 'company_id' || null
     
        if(!_orderingKey) throw Error('Incorrect data')

        const params = {
            orderingKey: _orderingKey,
            computorKey: property || '',
            operation: modeToOperation[ mode ] || ''
        }
        selectionParams.push( params )
    }

    const computedData = selectionParams.map( paramsDatum => {
        const result = computeChartData(
            data,
            paramsDatum.orderingKey,
            paramsDatum.computorKey,
            paramsDatum.operation
        )
        return result
    })

    return computedData
}

export const COMPANY_COLORS: Record<number, string> = {
  1860: "#8EC5FC", // Apple – soft blue
  1861: "#A8E6CF", // Amazon – pastel mint
  1862: "#FFD3B6", // Meta – soft peach
  1863: "#FFAAA5", // Microsoft – muted coral
  1864: "#D5AAFF", // Google – pastel violet
  1865: "#FFECB3", // Tesla – soft amber
  1866: "#BEE7E8", // Nvidia – pastel cyan
  1867: "#CBAACB", // Intel – dusty lavender
  1868: "#F6C1C7", // AMD – soft pink
  1869: "#CDE7BE", // Qualcomm – pastel green
  1870: "#B5C7ED", // Samsung – soft indigo
  1871: "#E2F0CB", // Sony – pale lime
  1872: "#F7D9E3", // Sony – pastel rose
  1873: "#D0F0FD", // Sony – light sky blue
  1874: "#FEE2B3", // Sony – soft peachy yellow
  1875: "#E3D4FF", // Sony – pastel lavender
  1876: "#B0E3D0", // Sony – minty green
  1877: "#FFD6E0", // Sony – pastel pink
  1878: "#C6DFFF", // Sony – baby blue
  1879: "#FFF3B0"  // Sony – soft yellow
};