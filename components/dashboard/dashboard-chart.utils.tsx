import { DashboadData, StatData } from "@/types/data.types";
import { IChartData } from "./dashboard-chart.types";
import _data_ from '../../public/data.json'
import { ChartConfig } from "../ui/chart";


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



export const groupBy = (stats: StatData[], key: keyof StatData) => {
    const dataMap = new Map()
    for( const data of stats ){

        if( data.hasOwnProperty( key )){
            const groupKey = data[key]

            if ( !dataMap.has(groupKey)){
                dataMap.set(groupKey, [])
            }

            dataMap
                .get(groupKey)
                .push(data)
        }
    }
    return dataMap
}

// TODO: getAverageData => computeAverageMetrics
// Ex: x: fiscal_year, y: ragr
/** Gets data structure (good for historical & global observation ) */
export const getAverageData = (data: DashboadData, orderingKey: keyof StatData, computorKey: keyof StatData, operation: 'average' | 'sum' | 'latest') => {
    const UIChartData = []
    
    // Process data to get data structure to work with
    const groupedByOrderingKey = groupBy(data.stats, orderingKey)

    // Per "orderingValue" (x axis key), loops to access the list of info
    for( const [ orderingValue, detailsList ] of groupedByOrderingKey ){
    console.log('detailsList:', detailsList)

        // From list of info, sums the values of  `computorKey` (y axis key)
        const summedValue = detailsList.reduce((acc: number, curr) => acc += (curr[computorKey] ?? 0), 0)

        const operations = {
            average: detailsList.length ? summedValue / detailsList.length : 0,
            sum: summedValue,
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

const averageRAGRPerYear = getAverageData( _data_, 'fiscal_year', 'RAGR', 'average' )
console.log('averageRAGRPerYear:', averageRAGRPerYear)




// export const getLatestMetrics = (data: DashboadData, orderingKey: keyof StatData, computorKey: keyof StatData, operation: 'average' | 'sum' | 'latest') => {  
//    const RAGRresult = getAverageData( data, orderingKey, computorKey, operation )
//    console.log('[ getLatestMetrics ] RAGRresult:', RAGRresult)
//    return RAGRresult

// }

// const latestMetrics = getLatestMetrics(_data_)



export const createChartConfig = (infoList: string[], description: string) : ChartConfig => {
  let config = {} 
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
const ownChartConfig = createChartConfig(['fiscal_year', 'RAGR'], 'Historic Average of RAGR')
console.log('🔥 ownChartConfig:', ownChartConfig)

// Chart Choices
// type MetricOperating = 'average' | 'sum'
// type MetricKey = 'RAGR' | 'economic_profit' | 'rcr_per_harm'



// const getHistoricalRAGR = (data: DashboadData) => {
//     return  getAverageData( data, 'fiscal_year', 'RAGR' )
// }

// const getLatestRAGR = (data: DashboadData) => {
//     const grouped = groupBy(data.stats, 'company_id')

// }

