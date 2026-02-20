/**
 * @fileoverview Dashboard Chart Utilities
 * Computes and formats chart data for visualization.
 */

import { groupBy } from "@/lib/utils";

import type { ChartConfig } from "@/components/ui/chart";
import type { DashboadData } from "@/types/data.types";
import type { IChartData } from "./dashboard-chart.types";
import type { FieldKey } from "../dashboard-features";

export function  getSumDetailsByKeys(  data: IChartData[], views: string[] ){
    if(!views.length || !data?.length) return;
    
    /** Init Views details */
    const _views : Record<string, number> = {}

    /* Builds splitted views */
    for (const view of views){
        for( const dataItem of data){

            /* Sets property in _views */
            if( !_views.hasOwnProperty( view ) ){
                _views[ view ] = 0
            }

            /* Sums number value from data with the view key */
            if( typeof dataItem[ view ] === 'number' ){
                _views[ view ] += dataItem[ view ]
            }
        }
        _views[ view ] =  Number(_views[ view ].toFixed(2))
    }
    return _views
}


/** Compute App raw data to chart data (line or bar charts)
 * - reorganize and manipulate data
 * - computed chart data base on params
*/
export const computeChartData = (
    data: DashboadData,
    orderingKey: FieldKey,
    computorKey: FieldKey,
    operation: 'average' | 'latest'
)=> {
    let UIChartData: Array<Record<string, number | string>> = []
    
    // Groups per "orderingKey"
    const groupedByOrderingKey = groupBy(data.stats, orderingKey)

    // Per "orderingValue" (x axis key), loops to access the list of info
    for( const [ orderingValue, detailsList ] of groupedByOrderingKey ){
        if ( !detailsList?.length ){ 
            UIChartData.push({[ orderingKey ]: orderingValue })
            continue
        }

        // From the info list, sums the values of `computorKey` (y axis key)
        const summedValue = detailsList.reduce(
            (acc: number, curr: { [x: string]: number; }) => acc += (curr[computorKey] ?? 0)
        , 0 )

        const operations = {
            average: detailsList.length ? summedValue / detailsList.length : 0,
            latest: detailsList.at(-1)[ computorKey ]
        }

        
        // Format to data chart
        const UIChartDatum = {
            [orderingKey]: orderingValue,
            [computorKey]: operations[ operation ],
        }

        UIChartData.push(UIChartDatum)
    }

    if(operation === 'latest'){
        UIChartData = UIChartData.sort((a, b ) => {
            if ( typeof b[ computorKey ] === 'number' && typeof a[ computorKey ] === "number"){
                return b[ computorKey ] - a[ computorKey ]
            }
            return 0
        })
    }

    return UIChartData
}


export const createChartConfig = (infoList: string[], description: string) : ChartConfig => {
  const config: ChartConfig = {}
  for( const index in infoList){
    const info = infoList[index]
    config[ info ] = {
      label: info.replaceAll(/[-_]/g, ' '),
      color: 'var(--chart-3)',
    }
  }
  config.views = { label: description }
  return config
}
