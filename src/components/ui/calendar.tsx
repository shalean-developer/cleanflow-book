import * as React from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { DayPicker } from "react-day-picker";

import { cn } from "@/lib/utils";
import { buttonVariants } from "@/components/ui/button";

export type CalendarProps = React.ComponentProps<typeof DayPicker>;

function Calendar({ className, classNames, showOutsideDays = true, ...props }: CalendarProps) {
  return (
    <DayPicker
      showOutsideDays={showOutsideDays}
      className={cn("p-4", className)}
      classNames={{
        months: "flex flex-col sm:flex-row space-y-4 sm:space-x-4 sm:space-y-0",
        month: "space-y-3",
        caption: "flex justify-center items-center relative pb-4",
        caption_label: "text-base font-semibold text-foreground",
        nav: "flex items-center gap-2 absolute inset-x-0 top-0",
        nav_button: cn(
          buttonVariants({ variant: "ghost" }),
          "h-7 w-7 bg-transparent p-0 hover:bg-transparent hover:text-primary transition-colors",
        ),
        nav_button_previous: "absolute left-0",
        nav_button_next: "absolute right-0",
        table: "w-full border-collapse",
        head_row: "flex w-full mb-1",
        head_cell: "text-muted-foreground w-9 font-normal text-xs uppercase flex items-center justify-center",
        row: "flex w-full mt-1",
        cell: "relative p-0.5 text-center",
        day: cn(
          "h-9 w-9 p-0 font-normal text-sm rounded-full inline-flex items-center justify-center transition-colors",
          "hover:bg-accent/50"
        ),
        day_range_end: "day-range-end",
        day_selected:
          "bg-[#0C53ED] text-white hover:bg-[#0C53ED] hover:text-white focus:bg-[#0C53ED] focus:text-white",
        day_today: "bg-transparent text-foreground font-semibold border border-border",
        day_outside:
          "text-muted-foreground/30 opacity-50",
        day_disabled: "text-muted-foreground/20 opacity-30 cursor-not-allowed hover:bg-transparent",
        day_range_middle: "aria-selected:bg-accent aria-selected:text-accent-foreground",
        day_hidden: "invisible",
        ...classNames,
      }}
      components={{
        Chevron: ({ orientation }) => 
          orientation === "left" ? (
            <ChevronLeft className="h-5 w-5" />
          ) : (
            <ChevronRight className="h-5 w-5" />
          ),
      }}
      {...props}
    />
  );
}
Calendar.displayName = "Calendar";

export { Calendar };
