import * as React from "react"

import { cn } from "@/lib/utils"

function Input({ className, type, ...props }: React.ComponentProps<"input">) {
  return (
    <input
      type={type}
      data-slot="input"
      className={cn(
        "border-input file:text-foreground placeholder:text-muted-foreground selection:bg-primary selection:text-primary-foreground flex h-9 w-full min-w-0 rounded-md border bg-transparent px-3 py-1 text-base shadow-xs transition-[color,box-shadow] outline-none file:inline-flex file:h-7 file:border-0 file:bg-transparent file:text-sm file:font-medium disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 md:text-sm",
        "focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px]",
        "aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive",
        className
      )}
      {...props}
    />
  )
}
interface InputRadioProps extends React.ComponentProps<"input"> {
  label?: string;
  labelClassName?: string;
  containerClassName?: string;
}

function InputRadio({
  className,
  label,
  labelClassName,
  containerClassName,
  ...props
}: InputRadioProps) {
  return (
    <div className={cn("flex items-center gap-2", containerClassName)}>
      <input
        type="radio"
        data-slot="input"
        className={cn(
          "h-4 w-4 border-input text-primary focus:ring-primary cursor-pointer rounded-full border bg-transparent shadow-xs transition-colors",
          "focus:ring-2 focus:ring-offset-2",
          "disabled:cursor-not-allowed disabled:opacity-50",
          "aria-invalid:border-destructive aria-invalid:text-destructive",
          className
        )}
        {...props}
      />
      {label && (
        <label
          htmlFor={props.id}
          className={cn(
            "text-sm font-medium leading-none text-black dark:text-white",
            "cursor-pointer peer-disabled:cursor-not-allowed peer-disabled:opacity-70",
            labelClassName
          )}
        >
          {label}
        </label>
      )}
    </div>
  );
}

export { Input, InputRadio }
