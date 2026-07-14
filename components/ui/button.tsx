import * as React from "react"
import { cn } from "@/lib/utils"

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "default" | "outline"
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "default", ...props }, ref) => {
    return (
      <button
        ref={ref}
        className={cn(
          "inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-teal)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--color-navy-deep)] disabled:pointer-events-none disabled:opacity-50 h-10 px-4 py-2",
          variant === "default" && "bg-[var(--color-teal)] text-[var(--color-navy-deep)] hover:bg-[var(--color-teal)]/90 font-bold",
          variant === "outline" && "border border-[var(--color-teal)] text-[var(--color-teal)] hover:bg-[var(--color-teal)]/10",
          className
        )}
        {...props}
      />
    )
  }
)
Button.displayName = "Button"

export { Button }
