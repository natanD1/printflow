import { parseBrazilianDate } from "@/utils/parse-brazilian-date";

export function isSameMonth(dateValue: string, reference: Date): boolean {
  const date = parseBrazilianDate(dateValue);
  return (
    date.getMonth() === reference.getMonth() &&
    date.getFullYear() === reference.getFullYear()
  );
}

export function isSameDay(dateValue: string, reference: Date): boolean {
  const date = parseBrazilianDate(dateValue);
  return date.toDateString() === reference.toDateString();
}
