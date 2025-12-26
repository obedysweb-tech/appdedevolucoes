import { Period } from "@/types";
import { startOfDay, endOfDay, startOfWeek, endOfWeek, startOfMonth, endOfMonth, startOfQuarter, endOfQuarter, startOfYear, endOfYear, subDays, subWeeks, subMonths } from "date-fns";

export function getDateRangeFromPeriod(period?: Period): { startDate?: Date; endDate?: Date } {
  if (!period) return {};
  
  const now = new Date();
  
  switch (period) {
    case 'TODAY':
      return {
        startDate: startOfDay(now),
        endDate: endOfDay(now)
      };
    case 'YESTERDAY':
      const yesterday = subDays(now, 1);
      return {
        startDate: startOfDay(yesterday),
        endDate: endOfDay(yesterday)
      };
    case 'THIS_WEEK':
      return {
        startDate: startOfWeek(now, { weekStartsOn: 1 }),
        endDate: endOfWeek(now, { weekStartsOn: 1 })
      };
    case 'LAST_WEEK':
      const lastWeek = subWeeks(now, 1);
      return {
        startDate: startOfWeek(lastWeek, { weekStartsOn: 1 }),
        endDate: endOfWeek(lastWeek, { weekStartsOn: 1 })
      };
    case 'THIS_MONTH':
      return {
        startDate: startOfMonth(now),
        endDate: endOfMonth(now)
      };
    case 'LAST_MONTH':
      const lastMonth = subMonths(now, 1);
      return {
        startDate: startOfMonth(lastMonth),
        endDate: endOfMonth(lastMonth)
      };
    case 'THIS_QUARTER':
      return {
        startDate: startOfQuarter(now),
        endDate: endOfQuarter(now)
      };
    case 'THIS_SEMESTER':
      const semesterStart = now.getMonth() < 6 
        ? new Date(now.getFullYear(), 0, 1)
        : new Date(now.getFullYear(), 6, 1);
      const semesterEnd = now.getMonth() < 6
        ? new Date(now.getFullYear(), 5, 30)
        : new Date(now.getFullYear(), 11, 31);
      return {
        startDate: startOfDay(semesterStart),
        endDate: endOfDay(semesterEnd)
      };
    case 'THIS_YEAR':
      return {
        startDate: startOfYear(now),
        endDate: endOfYear(now)
      };
    default:
      return {};
  }
}

