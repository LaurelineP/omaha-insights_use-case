"use client";

import {
  createContext,
  Dispatch,
  PropsWithChildren,
  SetStateAction,
  useEffect,
  useState,
} from "react";

type DashboardContextType = {
  selectedCharts: string[];
  setSelectedCharts: Dispatch<SetStateAction<string[]>>;
};

export const defaultSelection = [
  "RAGR__latest",
  "economic_profit__historical",
  "rcr_perc_harm__historical",
];

export const LOCALSTORE_SELECTION = "ziggy_selected-charts";

export const DashboardContext = createContext<DashboardContextType>({
  selectedCharts: [],
  setSelectedCharts: () => {},
});

export function DashboardProvider({ children }: PropsWithChildren) {
  // Initialize with specific empty for hydration safety & UX
  const [selectedCharts, setSelectedCharts] = useState<string[]>(
    Array(3).fill("")
  );
  // Track if we've loaded from localStorage this component lifetime
  const [isLoadedLS, setIsLoadedLS] = useState(false);

  // When mounting and remounts, load selection from localStorage
  useEffect(() => {
    if (!isLoadedLS) {
      try {
        const stored = localStorage.getItem(LOCALSTORE_SELECTION);
        if (stored) {
          // eslint-disable-next-line react-hooks/set-state-in-effect
          setSelectedCharts(JSON.parse(stored));
        }
      } catch(error) {
        console.error(error)
      }
      setIsLoadedLS(true);
    }
  }, [isLoadedLS]);

  // Persist any changes (initialization or UI updates) to localStorage
  useEffect(() => {
    if (isLoadedLS) {
      try {
        localStorage.setItem(
          LOCALSTORE_SELECTION,
          JSON.stringify(selectedCharts)
        );
      } catch {
        console.error("Failed to persist selection");
      }
    }
  }, [selectedCharts, isLoadedLS]);

  return (
    <DashboardContext.Provider value={{ selectedCharts, setSelectedCharts }}>
      {children}
    </DashboardContext.Provider>
  );
}
