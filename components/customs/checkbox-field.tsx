

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
    <div className={cn("cursor-pointer flex items-center", props?.className)} {...props}>
      <Field orientation="horizontal" aria-disabled={isDisabled} suppressHydrationWarning={true}>
        <Checkbox
          id            = { name }
          name          = { name }
          checked       = { checked }
          color         = "bg-primary"
          aria-disabled = { isDisabled }
          suppressHydrationWarning={true}
        />
        <Label
          className="text-xs text-sidebar-foreground w-full"
          htmlFor={name}
          aria-disabled={isDisabled}
        >
          { children }
        </Label>
      </Field>
    </div>
  );
};
