"use client";
import { DashboardChart } from "@/components/ui/dashboard/dashboard-chart";
import { DashboadData } from "@/types/data.types";
import { useEffect, useState } from "react";

export default function Dashboard() {
  const [data, setData] = useState<DashboadData | null>(null);

  useEffect(() => {
    fetch("/data.json")
      .then((res) => res.json())
      .then(setData);
  }, []);

  return (
    <div
      id="Dashboard"
      className="h-full w-full bg-slate-100 flex flex-col justify-center gap-4 px-6"
    >
      <div className="w-full">
        <DashboardChart />
      </div>
      <div className="w-full grid grid-cols-1 md:grid-cols-2 gap-4">
        <DashboardChart />
        <DashboardChart />
      </div>
    </div>
  );
}
