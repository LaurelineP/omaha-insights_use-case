import { DashboadData, StatData } from "@/types/data.types";
import { IChartData } from "./dashboard-chart.types";
import { ChartConfig } from "../ui/chart";
import { groupBy } from "@/lib/utils";



// type MetricKey = 'RAGR' | 'economic_profit' | 'rcr_per_harm'


export function  getSumDetailsByKeys(  data: IChartData[], views: string[] ){
    if(!views.length || !data?.length) return;
    
    /** Init Views details */
    const _views : Record<string, number> = {}

    /* Makes on object out of views with the matched value in data */
    for( const dataItem of data){
        for (const view of views){

            /* Sets property in _views */
            if( !_views.hasOwnProperty( view ) ){
                _views[ view ] = 0
            }

            /* Sums number value from data with the view key */
            if( typeof dataItem[ view ] === 'number' ){
                _views[ view ] += dataItem[ view ]
            }
        }
    }
    return _views
}


/** Compute App raw data to chart data (line or bar charts)*/
export const computeChartData = (
    data: DashboadData,
    orderingKey: keyof StatData,
    computorKey: keyof StatData, operation: 'average' | 'latest'
)=> {
    const UIChartData: Array<Record<string, number | string>> = []
    
    // Group per "orderingKey"
    const groupedByOrderingKey = groupBy(data.stats, orderingKey)

    // Per "orderingValue" (x axis key), loops to access the list of info
    for( const [ orderingValue, detailsList ] of groupedByOrderingKey ){
        if ( !detailsList?.length ){ 
            UIChartData.push({[ orderingKey ]: orderingValue })
            continue
        }

        // From list of info, sums the values of `computorKey` (y axis key)
        const summedValue = detailsList.reduce(
            (acc: number, curr) => acc += (curr[computorKey] ?? 0)
        ,0 )

        const operations = {
            average: detailsList.length ? summedValue / detailsList.length : 0,
            latest: detailsList.at(-1)[ computorKey ]
        }

        // Format to data chart
        // const average = detailsList.length ? summedValue / detailsList.length : 0
        const UIChartDatum = {
            [orderingKey]: orderingValue,
            [computorKey]: operations[ operation ]
        }
        UIChartData.push(UIChartDatum)
    }
    console.log('UIChartData:', UIChartData)
    return UIChartData
}
/// Example
// const averageRAGRPerYear = computeChartData( _data_, 'fiscal_year', 'RAGR', 'average' )


export const createChartConfig = (infoList: string[], description: string) : ChartConfig => {
  const config: ChartConfig = {} 
  for( const index in infoList){
    const info = infoList[index]

    config[ info ] = {
      label: info.replaceAll(/[-_]/g, ' '),
      color: `var(--chart-${index + 1})`,
    }
  }
  config.views = { label: description }
  return config
}
/// Example
// const ownChartConfig = createChartConfig(['fiscal_year', 'RAGR'], 'Historic Average of RAGR')

