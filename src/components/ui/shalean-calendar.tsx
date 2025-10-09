import React, { useMemo } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

/**
 * Calendar Component — Shalean UI
 * - Modern, responsive, accessible
 * - Primary color: #0C53ED
 * - Disables past dates by default (minDate=today)
 * - Props: value (Date), onChange(date), minDate (Date), month (0-11), year (e.g., 2025)
 * - Keyboard focusable days
 */

type CalendarProps = {
  value?: Date | null;
  onChange?: (d: Date) => void;
  minDate?: Date;
  month?: number; // 0-11
  year?: number;  // full year
  className?: string;
};

function startOfDay(d: Date) { const x = new Date(d); x.setHours(0,0,0,0); return x; }
function isSameDay(a: Date, b: Date) { return a.toDateString() === b.toDateString(); }
function addMonths(date: Date, count: number) {
  const d = new Date(date);
  d.setMonth(d.getMonth() + count);
  // handle month rollover for last-day cases
  if (d.getDate() !== date.getDate()) d.setDate(0);
  return d;
}
function daysInMonth(year: number, month: number) {
  return new Date(year, month + 1, 0).getDate();
}

export default function ShaleanCalendar({
  value = null,
  onChange,
  minDate = startOfDay(new Date()),
  month,
  year,
  className = "",
}: CalendarProps) {
  const today = startOfDay(new Date());
  const base = useMemo(() => {
    const now = new Date();
    return new Date(year ?? now.getFullYear(), month ?? now.getMonth(), 1);
  }, [month, year]);

  const [viewDate, setViewDate] = React.useState<Date>(base);
  React.useEffect(() => setViewDate(base), [base]);

  const y = viewDate.getFullYear();
  const m = viewDate.getMonth();
  const firstDay = new Date(y, m, 1);
  const firstWeekday = firstDay.getDay(); // 0=Sun
  const totalDays = daysInMonth(y, m);

  const grid: (Date | null)[] = []; // 6 rows * 7 cols = 42
  // leading blanks from previous month
  for (let i = 0; i < firstWeekday; i++) grid.push(null);
  // current month days
  for (let d = 1; d <= totalDays; d++) grid.push(new Date(y, m, d));
  // trailing blanks to fill 42
  while (grid.length < 42) grid.push(null);

  const monthName = viewDate.toLocaleString(undefined, { month: "long" });

  const isDisabled = (d: Date) => startOfDay(d) < startOfDay(minDate);

  const dayCellClasses = (d: Date) => {
    const selected = value && isSameDay(d, value);
    const isToday = isSameDay(d, today);
    const disabled = isDisabled(d);
    return [
      "relative flex h-10 w-10 items-center justify-center rounded-full text-sm transition",
      disabled ? "cursor-not-allowed text-slate-300" : "cursor-pointer hover:bg-[#0C53ED]/10",
      isToday && !selected ? "ring-1 ring-[#0C53ED]/40" : "",
      selected ? "bg-[#0C53ED] text-white hover:bg-[#0a46c6]" : "",
    ].join(" ");
  };

  return (
    <div className={`w-full max-w-md rounded-2xl border bg-white p-4 shadow-sm ${className}`}>
      {/* Header */}
      <div className="mb-3 flex items-center justify-between">
        <button
          aria-label="Previous month"
          className="inline-flex h-9 w-9 items-center justify-center rounded-lg border hover:bg-slate-50"
          onClick={() => setViewDate((d) => addMonths(d, -1))}
        >
          <ChevronLeft className="h-4 w-4" />
        </button>
        <div className="text-center">
          <div className="text-sm text-slate-500">{y}</div>
          <div className="text-lg font-semibold tracking-tight">{monthName}</div>
        </div>
        <button
          aria-label="Next month"
          className="inline-flex h-9 w-9 items-center justify-center rounded-lg border hover:bg-slate-50"
          onClick={() => setViewDate((d) => addMonths(d, 1))}
        >
          <ChevronRight className="h-4 w-4" />
        </button>
      </div>

      {/* Weekdays */}
      <div className="mb-2 grid grid-cols-7 text-center text-xs font-medium text-slate-500">
        {['Su','Mo','Tu','We','Th','Fr','Sa'].map((d) => (
          <div key={d} className="py-1">{d}</div>
        ))}
      </div>

      {/* Days grid */}
      <div className="grid grid-cols-7 gap-y-2 place-items-center">
        {grid.map((d, i) => (
          <div key={i} className="h-10 w-10">
            {d ? (
              <button
                className={dayCellClasses(d)}
                disabled={isDisabled(d)}
                onClick={() => !isDisabled(d) && onChange?.(d)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    if (!isDisabled(d)) onChange?.(d);
                  }
                }}
              >
                {d.getDate()}
              </button>
            ) : (
              <span className="block h-10 w-10" />
            )}
          </div>
        ))}
      </div>

      {/* Legend */}
      <div className="mt-4 flex items-center gap-4 text-xs text-slate-500">
        <div className="flex items-center gap-2"><span className="inline-block h-3 w-3 rounded-full bg-[#0C53ED]"/> Selected</div>
        <div className="flex items-center gap-2"><span className="inline-block h-3 w-3 rounded-full ring-1 ring-[#0C53ED]/50"/> Today</div>
        <div className="flex items-center gap-2"><span className="inline-block h-3 w-3 rounded-full bg-slate-300"/> Disabled</div>
      </div>
    </div>
  );
}
