import * as React from "react";
import { Check, Plus, X, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

export interface TimeSlot {
  day: string;
  start: string;
  end: string;
}

interface AvailabilitySelectorProps {
  value: TimeSlot[];
  onChange: (slots: TimeSlot[]) => void;
  className?: string;
}

const DAYS = [
  { value: "Monday", label: "Monday" },
  { value: "Tuesday", label: "Tuesday" },
  { value: "Wednesday", label: "Wednesday" },
  { value: "Thursday", label: "Thursday" },
  { value: "Friday", label: "Friday" },
  { value: "Saturday", label: "Saturday" },
  { value: "Sunday", label: "Sunday" },
];

const TIME_SLOTS = [
  "06:00", "06:30", "07:00", "07:30", "08:00", "08:30", "09:00", "09:30",
  "10:00", "10:30", "11:00", "11:30", "12:00", "12:30", "13:00", "13:30",
  "14:00", "14:30", "15:00", "15:30", "16:00", "16:30", "17:00", "17:30",
  "18:00", "18:30", "19:00", "19:30", "20:00", "20:30", "21:00", "21:30",
  "22:00"
];

export function AvailabilitySelector({ value, onChange, className }: AvailabilitySelectorProps) {
  const [selectedDay, setSelectedDay] = React.useState("");
  const [selectedStart, setSelectedStart] = React.useState("");
  const [selectedEnd, setSelectedEnd] = React.useState("");

  const handleAddSlot = () => {
    if (selectedDay && selectedStart && selectedEnd) {
      if (selectedStart >= selectedEnd) {
        alert("Start time must be before end time");
        return;
      }

      const newSlot: TimeSlot = {
        day: selectedDay,
        start: selectedStart,
        end: selectedEnd,
      };

      // Check if this exact slot already exists
      const exists = value.some(
        slot => slot.day === selectedDay && slot.start === selectedStart && slot.end === selectedEnd
      );

      if (exists) {
        alert("This time slot already exists");
        return;
      }

      onChange([...value, newSlot]);
      setSelectedDay("");
      setSelectedStart("");
      setSelectedEnd("");
    }
  };

  const handleRemoveSlot = (index: number) => {
    onChange(value.filter((_, i) => i !== index));
  };

  const formatTime = (time: string) => {
    const [hours, minutes] = time.split(':');
    const hour = parseInt(hours);
    const ampm = hour >= 12 ? 'PM' : 'AM';
    const displayHour = hour === 0 ? 12 : hour > 12 ? hour - 12 : hour;
    return `${displayHour}:${minutes} ${ampm}`;
  };

  const getAvailableStartTimes = () => {
    return TIME_SLOTS;
  };

  const getAvailableEndTimes = (startTime: string) => {
    if (!startTime) return TIME_SLOTS;
    return TIME_SLOTS.filter(time => time > startTime);
  };

  // Group slots by day for better display
  const groupedSlots = value.reduce((acc, slot) => {
    if (!acc[slot.day]) {
      acc[slot.day] = [];
    }
    acc[slot.day].push(slot);
    return acc;
  }, {} as Record<string, TimeSlot[]>);

  return (
    <div className={cn("space-y-4", className)}>
      {/* Add New Slot */}
      <div className="border rounded-lg p-4 bg-muted/50">
        <Label className="text-sm font-medium mb-3 block">Add Time Slot</Label>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-3 items-end">
          <div>
            <Label htmlFor="day-select" className="text-xs">Day</Label>
            <Select value={selectedDay} onValueChange={setSelectedDay}>
              <SelectTrigger>
                <SelectValue placeholder="Select day" />
              </SelectTrigger>
              <SelectContent>
                {DAYS.map((day) => (
                  <SelectItem key={day.value} value={day.value}>
                    {day.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="start-select" className="text-xs">Start Time</Label>
            <Select value={selectedStart} onValueChange={setSelectedStart}>
              <SelectTrigger>
                <SelectValue placeholder="Start" />
              </SelectTrigger>
              <SelectContent>
                {getAvailableStartTimes().map((time) => (
                  <SelectItem key={time} value={time}>
                    {formatTime(time)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="end-select" className="text-xs">End Time</Label>
            <Select 
              value={selectedEnd} 
              onValueChange={setSelectedEnd}
              disabled={!selectedStart}
            >
              <SelectTrigger>
                <SelectValue placeholder="End" />
              </SelectTrigger>
              <SelectContent>
                {getAvailableEndTimes(selectedStart).map((time) => (
                  <SelectItem key={time} value={time}>
                    {formatTime(time)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <Button
            onClick={handleAddSlot}
            disabled={!selectedDay || !selectedStart || !selectedEnd}
            size="sm"
            className="h-10"
          >
            <Plus className="h-4 w-4 mr-1" />
            Add
          </Button>
        </div>
      </div>

      {/* Current Slots */}
      {value.length > 0 && (
        <div>
          <Label className="text-sm font-medium mb-3 block">
            Current Availability ({value.length} slots)
          </Label>
          <div className="space-y-3">
            {Object.entries(groupedSlots)
              .sort(([a], [b]) => {
                const dayOrder = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];
                return dayOrder.indexOf(a) - dayOrder.indexOf(b);
              })
              .map(([day, slots]) => (
                <div key={day} className="border rounded-lg p-3">
                  <div className="flex items-center gap-2 mb-2">
                    <Clock className="h-4 w-4 text-muted-foreground" />
                    <span className="font-medium text-sm">{day}</span>
                    <Badge variant="secondary" className="text-xs">
                      {slots.length} slot{slots.length !== 1 ? 's' : ''}
                    </Badge>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {slots
                      .sort((a, b) => a.start.localeCompare(b.start))
                      .map((slot, index) => {
                        const originalIndex = value.findIndex(
                          s => s.day === slot.day && s.start === slot.start && s.end === slot.end
                        );
                        return (
                          <div
                            key={`${slot.day}-${slot.start}-${slot.end}`}
                            className="flex items-center gap-2 bg-background border rounded-md px-3 py-1.5"
                          >
                            <Check className="h-3 w-3 text-green-600" />
                            <span className="text-sm font-mono">
                              {formatTime(slot.start)} - {formatTime(slot.end)}
                            </span>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleRemoveSlot(originalIndex)}
                              className="h-6 w-6 p-0 hover:bg-destructive hover:text-destructive-foreground"
                            >
                              <X className="h-3 w-3" />
                            </Button>
                          </div>
                        );
                      })}
                  </div>
                </div>
              ))}
          </div>
        </div>
      )}

      {/* Quick Presets */}
      <div className="border rounded-lg p-4 bg-muted/20">
        <Label className="text-sm font-medium mb-3 block">Quick Presets</Label>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              const weekdays = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"];
              const newSlots: TimeSlot[] = weekdays.map(day => ({
                day,
                start: "08:00",
                end: "17:00"
              }));
              onChange(newSlots);
            }}
            disabled={value.length > 0}
          >
            Weekdays 8AM-5PM
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              const allDays = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];
              const newSlots: TimeSlot[] = allDays.map(day => ({
                day,
                start: "09:00",
                end: "18:00"
              }));
              onChange(newSlots);
            }}
            disabled={value.length > 0}
          >
            Every Day 9AM-6PM
          </Button>
        </div>
      </div>
    </div>
  );
}
