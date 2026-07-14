import * as React from "react"
import { cn } from "@/lib/utils"

const Select = React.forwardRef<HTMLSelectElement, React.SelectHTMLAttributes<HTMLSelectElement>>(
  ({ className, ...props }, ref) => {
    return (
      <select
        className={cn(
          "flex h-10 w-full rounded-md border border-[var(--color-slate-gray)] bg-[var(--color-navy-deep)] px-3 py-2 text-sm text-[var(--color-offwhite)] ring-offset-[var(--color-navy-deep)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-teal)] focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
          className
        )}
        ref={ref}
        {...props}
      />
    )
  }
)
Select.displayName = "Select"

export { Select }
