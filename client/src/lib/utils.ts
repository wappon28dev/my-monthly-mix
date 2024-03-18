import { type Entries } from "@/types/utils";
import { siteId } from "./info";
import { type MonthlyDate } from "@/types/monthly";

export async function waitMs(ms: number): Promise<void> {
  await new Promise((resolve) => {
    setTimeout(resolve, ms);
  });
}

export function getKeys<T extends Record<string, unknown>>(
  obj: T,
): Array<keyof T> {
  return Object.keys(obj);
}
export function getValues<T extends Record<string, any>>(
  obj: T,
): Array<T[keyof T]> {
  return Object.values(obj);
}
export function getEntries<T extends Record<string, unknown>>(
  obj: T,
): Entries<T> {
  return Object.entries(obj) as Entries<T>;
}
export function fromEntries<T extends Record<string, unknown>>(
  entries: Entries<T>,
): T {
  return Object.fromEntries(entries) as T;
}

export const LOCAL_STORAGE_VERSION = "1";
export function getLocalStorageKey(key: string, trailingColon = false): string {
  return `${siteId}.v${LOCAL_STORAGE_VERSION}.${key}${trailingColon ? ":" : ""}`;
}

export const getMonthlyDate = (date: Date): MonthlyDate => ({
  year: date.getFullYear(),
  month: date.getMonth() + 1,
});

export const monthlyDate2str = (date: MonthlyDate): string =>
  `${date.year}-${date.month.toString().padStart(2, "0")}`;
