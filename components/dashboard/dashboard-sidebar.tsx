"use client";
import { cn, groupBy } from "@/lib/utils";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarHeader,
} from "../ui/sidebar";
import {
  ChartViewOption,
  configSelectionMap,
  metricDescription,
  MetricType,
  tooltipDescriptions,
} from "./dashboard-features";
import {
  FieldDescription,
  FieldGroup,
  FieldLegend,
  FieldSet,
} from "../ui/field";

import { Separator } from "@/components/ui/separator";
import { useContext, useState } from "react";
import { CheckboxField } from "../customs/checkbox-field";
import { DashboardContext } from "@/context/dashboard.context";

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
 
  let timeId
  const triggerReminder = () => {
    if(timeId) clearTimeout(timeId);
      setDidClickOnDisabled(true)

    timeId = setTimeout(() => {
      return setDidClickOnDisabled(false)
    }, 1_000)

  }


  const handleCheckboxChange = (e) => {
    if( e.target.role !== 'checkbox' ) return;
    const fieldId = e.target.id
    const isDisabled = e.target.ariaDisabled === 'false' ? false : true

    /* Visually reminds the selection guideline once clicked on disabled checkbox */
    if( isDisabled ){
      return triggerReminder()
    } 
      

    setSelectedCharts((prev) => {

      const fieldKeyIndex = prev.indexOf(fieldId);
      const emptyIndex = prev.indexOf('');
      const nextFields = [...prev]
    
      /* Replace empty value placeholder with this selection */
      if( emptyIndex >= 0 && fieldKeyIndex === -1 ){
        nextFields.splice(emptyIndex, 1, fieldId);
      }
      
      /* Replace this unselection with a placeholder */
      else if ( fieldKeyIndex >= 0 ){
        nextFields.splice(fieldKeyIndex, 1, '');
      }
      return nextFields
    });



  }
  return (
    <Sidebar>
      <SidebarContent className="mx-6 py-10 gap-12">
        <SidebarHeader className="font-bold">
          Metric Views
          <div className="font-normal text-xxl text-gray-500 text-sm leading-4 flex flex-col gap-2">
            <p className={cn(didClickOnDisabled && "animate-wiggle")}>Pick <b>exactly 3 metrics</b> to display in the dashboard charts.</p>
            <p>You can uncheck a selected metric to replace it with another.</p>
          </div>

        </SidebarHeader>
        {checkboxesStructure?.map(([group, options], idx) => {
          const description = metricDescription?.[group as MetricType]
            ?.split("\n")
            .map((text: string, idx: number) => (
              <span key={`${group}-${idx}`} className="block my-2">
                {text}
              </span>
            ));
          return (
            <SidebarGroup key={idx} className="gap-4 w-full">
              <FieldSet className="ml-2.5" onClick={handleCheckboxChange}  >
                <FieldLegend className="capitalize flex items-center w-full text-xxs font-semibold">
                  {group} <Separator />
                </FieldLegend>
                <FieldDescription className="text-xs italic">
                  {description}
                </FieldDescription>
                <FieldGroup className="text-sm gap-2">
                  {options.map(( option, idx: number) => {
                    const isDisabled = (selectedCharts.filter(Boolean).length === 3 && !selectedCharts.includes(option.fieldKey))
                    return (
                      <CheckboxField key = {`${ option.fieldKey }-${ idx }`}
                        className   = "ml-4"
                        name        = { option.fieldKey }
                        isDisabled  = { isDisabled }
                        checked     = { selectedCharts?.includes( option.fieldKey )}
                      >
                        { tooltipDescriptions[ option.fieldKey as ChartViewOption ]}
                      </CheckboxField>
                    )
                  })}
                </FieldGroup>
              </FieldSet>
            </SidebarGroup>
          );
        })}
      </SidebarContent>
      <SidebarFooter />
    </Sidebar>
  );
}
