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
      className={cn("p-6", className)}
      classNames={{
        months: "flex flex-col sm:flex-row space-y-4 sm:space-x-4 sm:space-y-0",
        month: "space-y-6",
        caption: "flex justify-center items-center relative pb-6",
        caption_label: "text-lg font-semibold text-center",
        nav: "flex items-center absolute inset-x-0 top-0",
        nav_button: cn(
          buttonVariants({ variant: "ghost" }),
          "h-9 w-9 bg-transparent p-0 hover:bg-accent/50 rounded-full transition-all duration-200",
        ),
        nav_button_previous: "absolute left-0",
        nav_button_next: "absolute right-0",
        table: "w-full border-collapse space-y-1",
        head_row: "flex w-full gap-1 mb-2",
        head_cell: "text-muted-foreground rounded-md w-11 font-medium text-sm flex items-center justify-center",
        row: "flex w-full gap-1 mt-1",
        cell: "relative p-0 text-center focus-within:relative focus-within:z-20",
        day: cn(
          "h-11 w-11 p-0 font-normal rounded-lg inline-flex items-center justify-center transition-all duration-200",
          "hover:bg-accent/50 hover:border hover:border-accent hover:scale-105",
          "border border-transparent",
          "text-sm"
        ),
        day_range_end: "day-range-end",
        day_selected:
          "bg-[#0C53ED] text-white hover:bg-[#0C53ED] hover:text-white focus:bg-[#0C53ED] focus:text-white border-[#0C53ED] shadow-md scale-105",
        day_today: "bg-accent/30 text-accent-foreground font-semibold border-accent",
        day_outside:
          "day-outside text-muted-foreground/40 opacity-50 hover:opacity-75",
        day_disabled: "text-muted-foreground/30 opacity-30 cursor-not-allowed hover:bg-transparent hover:border-transparent hover:scale-100",
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
