/**
 * Date adapter interface for abstracting date/time operations.
 * This allows the library to work with any date library (Luxon, date-fns, Day.js, etc.)
 */
export interface DateAdapter<T = unknown> {
  /**
   * Get the year component
   */
  getYear(date: T): number;

  /**
   * Get the month component (1-12)
   */
  getMonth(date: T): number;

  /**
   * Get the day component
   */
  getDay(date: T): number;

  /**
   * Get the hour component (0-23)
   */
  getHour(date: T): number;

  /**
   * Get the minute component (0-59)
   */
  getMinute(date: T): number;

  /**
   * Get the second component (0-59)
   */
  getSecond(date: T): number;

  /**
   * Get the timezone name (e.g., "Asia/Seoul", "America/New_York")
   */
  getZoneName(date: T): string;

  /**
   * Add minutes to a date
   */
  plusMinutes(date: T, minutes: number): T;

  /**
   * Add days to a date
   */
  plusDays(date: T, days: number): T;

  /**
   * Subtract days from a date
   */
  minusDays(date: T, days: number): T;

  /**
   * Convert to UTC
   */
  toUTC(date: T): T;

  /**
   * Convert to ISO string
   */
  toISO(date: T): string;

  /**
   * Convert to milliseconds since epoch
   */
  toMillis(date: T): number;

  /**
   * Create a date from milliseconds since epoch
   */
  fromMillis(millis: number, zone: string): T;

  /**
   * Create a UTC date
   */
  createUTC(
    year: number,
    month: number,
    day: number,
    hour: number,
    minute: number,
    second: number,
  ): T;

  /**
   * Set the timezone of a date without changing the underlying instant
   */
  setZone(date: T, zoneName: string): T;

  /**
   * Compare two dates (returns true if date1 >= date2)
   */
  isGreaterThanOrEqual(date1: T, date2: T): boolean;
}
