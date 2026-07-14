import * as React from "react"
import { cn } from "@/lib/utils"

const Checkbox = React.forwardRef<HTMLInputElement, React.InputHTMLAttributes<HTMLInputElement>>(
  ({ className, ...props }, ref) => (
    <input
      type="checkbox"
      ref={ref}
      className={cn(
        "peer h-4 w-4 shrink-0 rounded-sm border border-[var(--color-slate-gray)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-teal)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--color-navy-deep)] disabled:cursor-not-allowed disabled:opacity-50 text-[var(--color-teal)] bg-[var(--color-navy-deep)] accent-[var(--color-teal)]",
        className
      )}
      {...props}
    />
  )
)
Checkbox.displayName = "Checkbox"

export { Checkbox }
