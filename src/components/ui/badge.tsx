
import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const badgeVariants = cva(
  "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
  {
    variants: {
      variant: {
        default:
          "border-transparent bg-rhino-blue text-white hover:bg-rhino-blue/80",
        secondary:
          "border-transparent bg-secondary text-secondary-foreground hover:bg-secondary/80",
        destructive:
          "border-transparent bg-destructive text-destructive-foreground hover:bg-destructive/80",
        outline: "text-foreground",
        success:
          "border-transparent bg-emerald-600 text-white hover:bg-emerald-700",
        warning:
          "border-transparent bg-orange-600 text-white hover:bg-orange-700",
        info:
          "border-transparent bg-rhino-blue text-white hover:bg-rhino-blue/80",
        pending:
          "border-transparent bg-slate-500 text-white hover:bg-slate-600",
        featured:
          "border-transparent bg-gradient-to-r from-rhino-blue to-blue-600 text-white hover:from-blue-600 hover:to-blue-700",
        gold:
          "border-transparent bg-amber-500 text-white hover:bg-amber-600",
        community:
          "border-transparent bg-purple-500 text-white hover:bg-purple-600",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return (
    <div className={cn(badgeVariants({ variant }), className)} {...props} />
  )
}

export { Badge, badgeVariants }
