import * as React from "react";
import * as CheckboxPrimitive from "@radix-ui/react-checkbox";
import { cva, type VariantProps } from "class-variance-authority";
import { Check } from "lucide-react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

const checkboxVariants = cva(
  "peer shrink-0 transition-all duration-150 ease-in-out",
  {
    variants: {
      variant: {
        default:
          "h-4 w-4 rounded border bg-white focus:outline-none focus:ring-2 focus:ring-ring disabled:opacity-50 [&:has([data-state=checked])]:bg-primary",
        professionalBlue:
          // base look
          "h-5 w-5 rounded-lg border-2 bg-white shadow-sm " +
          "hover:shadow-md focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-sky-600 " +
          "dark:border-slate-700 dark:bg-slate-800 dark:hover:shadow-lg dark:focus-visible:ring-sky-400 " +
          // checked state
          "[&:has([data-state=checked])]:bg-gradient-to-br [&:has([data-state=checked])]:from-sky-500 " +
          "[&:has([data-state=checked])]:to-sky-700 [&:has([data-state=checked])]:border-transparent " +
          "[&:has([data-state=checked])]:shadow-lg " +
          "dark:[&:has([data-state=checked])]:from-sky-600 dark:[&:has([data-state=checked])]:to-sky-400",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
);

export interface CheckboxProps
  extends React.ComponentPropsWithoutRef<typeof CheckboxPrimitive.Root>,
  VariantProps<typeof checkboxVariants> { }

const Checkbox = React.forwardRef<
  React.ElementRef<typeof CheckboxPrimitive.Root>,
  CheckboxProps
>(({ className, variant, ...props }, ref) => (
  <CheckboxPrimitive.Root
    ref={ref}
    className={cn(checkboxVariants({ variant, className }))}
    {...props}
  >
    <CheckboxPrimitive.Indicator className="flex items-center justify-center text-white">
      <motion.div
        initial={{ scale: 0.6, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.15 }}
      >
        <Check className="h-4 w-4" />
      </motion.div>
    </CheckboxPrimitive.Indicator>
  </CheckboxPrimitive.Root>
));
Checkbox.displayName = CheckboxPrimitive.Root.displayName;

export { Checkbox };
