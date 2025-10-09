export function generateTimeSlots(): string[] {
  const slots: string[] = [];
  const startHour = 7;
  const endHour = 13;
  
  for (let hour = startHour; hour < endHour; hour++) {
    slots.push(`${hour.toString().padStart(2, '0')}:00`);
    slots.push(`${hour.toString().padStart(2, '0')}:30`);
  }
  
  return slots;
}

export function filterPastSlots(date: string, slots: string[]): string[] {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  
  const selectedDate = new Date(date);
  selectedDate.setHours(0, 0, 0, 0);
  
  // If not today, return all slots
  if (selectedDate.getTime() !== today.getTime()) {
    return slots;
  }
  
  // Filter out past times for today
  const now = new Date();
  const currentHour = now.getHours();
  const currentMinute = now.getMinutes();
  
  return slots.filter((slot) => {
    const [hourStr, minuteStr] = slot.split(':');
    const slotHour = parseInt(hourStr, 10);
    const slotMinute = parseInt(minuteStr, 10);
    
    if (slotHour > currentHour) return true;
    if (slotHour === currentHour && slotMinute > currentMinute) return true;
    return false;
  });
}
