"use client";

import { useSyncExternalStore } from "react";

const subscribe = () => () => {};

export default function ActivityLogTime({ value }: { value: string }) {
  const formattedTime = useSyncExternalStore(
    subscribe,
    () => new Date(value).toLocaleString(),
    () => new Date(value).toLocaleString("en-US", { timeZone: "UTC" }),
  );

  return <time dateTime={value}>{formattedTime}</time>;
}
