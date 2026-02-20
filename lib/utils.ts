import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}



// TODO: place it to global utils
export const groupBy = (arr: Record<string, unknown>[], key: string) => {
    const dataMap = new Map()
    for( const data of arr ){

        if( data.hasOwnProperty( key )){
            const groupKey = data[ key ]

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
