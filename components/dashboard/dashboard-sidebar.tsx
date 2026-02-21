"use client";
import { cn, groupBy } from "@/lib/utils";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarHeader,
} from "../ui/sidebar";
import {
  ChartViewOption,
  configSelectionMap,
  metricDescription,
  metricTextMap,
  MetricType,
} from "./dashboard-features";
import {
  FieldDescription,
  FieldGroup,
  FieldLegend,
  FieldSet,
} from "../ui/field";

import { Separator } from "@/components/ui/separator";
import { useContext, useRef, useState } from "react";
import { CheckboxField } from "../customs/checkbox-field";
import { DashboardContext, LOCALSTORE_SELECTION } from "@/context/dashboard.context";
import {
  ChartBarIcon,
  ChartSplineIcon,
  HomeIcon,
  InfoIcon,
  LayoutPanelTopIcon,
} from "lucide-react";
import Link from "next/link";

/** Fields props to provide the checkboxes UI */
const getFieldsProps = () => {
  const result = configSelectionMap.map((option) => {
    const fieldKey = `${option.metric}__${option.type}` as const;
    return {
      ...option,
      fieldKey,
    };
  });

  const structuredResult = Array.from(groupBy(result, "type"));
  return structuredResult;
};

export default function DashboardSidebar() {
  const { selectedCharts, setSelectedCharts } = useContext(DashboardContext)
  const checkboxesStructure = getFieldsProps()
  const [didClickOnDisabled, setDidClickOnDisabled] = useState(false)
  const reminderTimer = useRef<ReturnType<typeof setTimeout> | null>(null)

  const triggerReminder = () => {
    if (reminderTimer.current) clearTimeout(reminderTimer.current)
    setDidClickOnDisabled(true)
    reminderTimer.current = setTimeout(() => {
      setDidClickOnDisabled(false)
    }, 1_000)
  }

  /** Handles any checkbox changes  */
  const handleCheckboxChanges = (e: React.MouseEvent<HTMLFieldSetElement>) => {
    const target = e.target as HTMLElement;
    if (target.role !== "checkbox") return
    const fieldId = target.id
    const isDisabled = target.ariaDisabled === "false" ? false : true

    /* Visually reminds the selection guideline once clicked on disabled checkbox */
    if (isDisabled) {
      return triggerReminder()
    }

    setSelectedCharts((prev) => {
      const fieldKeyIndex = prev.indexOf(fieldId);
      const emptyIndex = prev.indexOf("");
      const nextFields = [...prev];

      /* Replace empty value placeholder with this selection */
      if (emptyIndex >= 0 && fieldKeyIndex === -1) {
        nextFields.splice(emptyIndex, 1, fieldId);
      } else if (fieldKeyIndex >= 0) {

      /* Replace this unselection with a placeholder */
        nextFields.splice(fieldKeyIndex, 1, "");

      }
      localStorage.setItem(LOCALSTORE_SELECTION, JSON.stringify(selectedCharts))
      return nextFields;
    });


  };
  
  return (
    <Sidebar className="bg-sidebar-primary shadow-xl ">
      {/* ----------------------------- Sidebar Header ----------------------------- */}
      <SidebarHeader className="px-4 pt-6 leading-4">
        <div className="flex gap-2 items-center">
          <button title="Home">
            <Link
              href="/"
              className="inline-flex gap-2 p-1 rounded bg-primary text-primary-foreground shadow-lg shadow-primary/20 transition-all hover:bg-primary/90 hover:shadow-xl hover:shadow-primary/30"
            >
              <HomeIcon className="text-primary-foreground shadow-2xl p-1.5 h-8 w-8 rounded z-10" />
            </Link>
          </button>
          <Separator orientation="vertical" />
          <h1 className="text-2xl font-semibold text-indigo-800">
            Metric Views
          </h1>
        </div>

        {/* Description */}
        <div className="flex flex-col font-normal text-gray-500 p-2">
          <div
            className={cn(
              "flex items-center font-normal text-xxl text-gray-500 text-sm gap-2 rounded p-1.5 justify-between border border-transparent",
              didClickOnDisabled &&
                "bg-warning/10 text-warning border boder-warning/20 animate-shake"
            )}
          >
            <p className="wrap-break-word w-fit">
              Pick <b>exactly 3 metrics</b> to
              <br /> display in the dashboard charts.
            </p>
            <LayoutPanelTopIcon size={20} strokeWidth={1.4} />
          </div>
          <p className="text-gray-500 text-sm leading-4 font-normal p-2">
            You can uncheck a selected metric to replace it with another.
          </p>
        </div>
        <Separator className="my-4" />
      </SidebarHeader>

      {/* ----------------------------- Sidebar Content ---------------------------- */}
      <SidebarContent className="m-4">
        {checkboxesStructure?.map(([group, options], idx) => {
          const description = metricDescription?.[group as MetricType]
            ?.split("\n")
            .map((text: string, idx: number) => (
              <span
                key={`${group}-${idx}`}
                className={cn("flex my-2", idx === 0 && "flex-stretch")}
              >
                {text}
              </span>
            ));
          return (
            /* ----------------- Sidebar Content Group by kind of charts ---------------- */
            <SidebarGroup key={idx} className="w-full pb-10">
              <FieldSet
                className="ml-2.5 my-0 gap-0"
                onClick={handleCheckboxChanges}
              >
                <FieldLegend className="capitalize flex w-full text-xxs font-semibold gap-4 text-indigo-800">
                  <div className="flex gap-2 items-center">
                    {group === "historical" && <ChartSplineIcon size={15} />}
                    {group === "latest" && <ChartBarIcon size={15} />}
                    {group}
                  </div>
                </FieldLegend>

                <FieldDescription className="text-xs flex justify-center items-center">
                  <InfoIcon className="flex self-start mt-1 mx-1" />
                  <span className="flex gap-4">{description}</span>
                </FieldDescription>

                <FieldGroup className="text-sm gap-2 pl-4 mt-3">
                  {options.map(
                    (
                      option: {
                        fieldKey: Exclude<ChartViewOption, "">;
                        metric: string;
                        type: string;
                      },
                      idx: number
                    ) => {
                      const isDisabled =
                        selectedCharts?.filter(Boolean).length === 3 &&
                        !selectedCharts.includes(option.fieldKey);
                      const isSelelected = selectedCharts?.includes(
                        option.fieldKey
                      );
                      const selectedIndex = selectedCharts?.indexOf(
                        option.fieldKey
                      );
                      return (
                        <CheckboxField
                          key={`${option.fieldKey}-${idx}`}
                          name={option.fieldKey}
                          isDisabled={isDisabled}
                          checked={isSelelected}
                        >
                          <div className="flex w-full justify-between h-5">
                            <span className="inline">
                              {metricTextMap[option.fieldKey].chartTooltip}
                            </span>
                            {isSelelected && (
                              <span className="inline rounded-2xl border px-2 py-1 uppercase text-[.5rem] text-primary/65 border-primary/65">
                                {selectedIndex === 0 && "top"}
                                {selectedIndex === 1 && "left"}
                                {selectedIndex === 2 && "right"}
                              </span>
                            )}
                          </div>
                        </CheckboxField>
                      );
                    }
                  )}
                </FieldGroup>
              </FieldSet>
            </SidebarGroup>
          );
        })}
      </SidebarContent>
    </Sidebar>
  );
}
