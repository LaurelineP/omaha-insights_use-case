import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const groupBy = <T extends object>(arr: readonly T[], key: string) => {
    const dataMap = new Map()
    for( const data of arr ){

        if( data.hasOwnProperty( key )){
            const groupKey = data[ key as keyof T ]

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
