"use client"

import { createContext,  Dispatch,  PropsWithChildren,  SetStateAction,  useState } from 'react'

const defaultSelection = [
  "RAGR__latest",
  "economic_profit__historical",
  "rcr_perc_harm__historical",
];


type DashboardContextType = {
  selectedCharts: string[];
  setSelectedCharts: Dispatch<SetStateAction<string[]>>;
};

export const DashboardContext = createContext<DashboardContextType>({
    selectedCharts : [],
    setSelectedCharts : () => {}
})



export function DashboardProvider({ children }: PropsWithChildren){
    const [selectedCharts, setSelectedCharts ] = useState(defaultSelection)
    return(
        <DashboardContext.Provider value={{ selectedCharts, setSelectedCharts} }>
            {children}
        </DashboardContext.Provider>
    )
}
