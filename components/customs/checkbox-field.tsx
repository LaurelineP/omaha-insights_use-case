
import { Checkbox } from "@/components/ui/checkbox";
import { Field } from "@/components/ui/field";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";

// export const CheckboxField = ({key, option, isDisabled, checked, children }) => {
export const CheckboxField = ({
  name,
  isDisabled,
  checked,
  children,
  ...props
}) => {
  return (
    <div {...props} className={cn("cursor-pointer", !!props?.className && props.className)}>
      <Field orientation="horizontal" aria-disabled={isDisabled}>
        <Checkbox
          id={name}
          name={name}
          // checked={fields.includes(option.fieldKey)}
          checked={checked}
          aria-disabled={isDisabled}
        />
        <Label
          className={cn(
            "text-xs font-semibold text-sidebar-foreground",
            isDisabled && "text-gray-400"
          )}
          htmlFor={name}
          aria-disabled={isDisabled}
        >
          {children}
        </Label>
      </Field>
    </div>
  );
};
