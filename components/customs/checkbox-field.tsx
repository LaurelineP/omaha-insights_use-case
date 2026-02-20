
import { ComponentProps, ReactNode } from "react";
import { Checkbox } from "@/components/ui/checkbox";
import { Field } from "@/components/ui/field";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";

interface CheckboxFieldProps extends ComponentProps<'div'> {
  name: string;
  isDisabled: boolean;
  checked: boolean;
  children: ReactNode;
}

export const CheckboxField = ({
  name,
  isDisabled,
  checked,
  children,
  ...props
}: CheckboxFieldProps) => {
  return (
    <div className = { cn("cursor-pointer flex items-center ", !!props?.className && props.className ,  isDisabled && "hover:cursor-not-allowed")} { ...props }>
      <Field
        orientation     = "horizontal"
        aria-disabled   = { isDisabled }
        >
        <Checkbox
          id            = { name }
          name          = { name }
          checked       = { checked }
          aria-disabled = { isDisabled }
          color         = "bg-indigo-900"
        />
        <Label
          className = {cn(
            "text-xs text-sidebar-foreground w-full",
            isDisabled && "text-gray-400"
          )}
          htmlFor       = { name }
          aria-disabled = { isDisabled }
        >
          { children }
        </Label>
      </Field>
    </div>
  );
};
