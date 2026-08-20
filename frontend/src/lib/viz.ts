"use client";

import { useSyncExternalStore } from "react";

import type { InvoiceStatus } from "./types";

/* ---------------------------------------------------------------------------
   Chart palette. Both modes are selected — the dark column is the same hues
   re-stepped for the dark surface, not an automatic flip. The categorical
   slots and the sequential ramp below are validated (lightness band, chroma
   floor, CVD separation, normal-vision floor, contrast); re-run the validator
   before changing any hex. Mirrors the CSS tokens in app/globals.css.
--------------------------------------------------------------------------- */

export type VizTheme = {
  surface: string;
  grid: string;
  axis: string;
  /** Categorical slots, assigned in fixed order — never cycled. */
  series: [string, string, string];
  /** Sequential blue ramp, largest value first. */
  sequential: string[];
  status: Record<"good" | "warning" | "serious" | "critical", string>;
};

const light: VizTheme = {
  surface: "#fcfcfb",
  grid: "#e6e5e1",
  axis: "#7a7975",
  series: ["#2a78d6", "#eb6834", "#1baf7a"],
  sequential: ["#1c5cab", "#256abf", "#2a78d6", "#5598e7", "#86b6ef"],
  status: {
    good: "#0ca30c",
    warning: "#fab219",
    serious: "#ec835a",
    critical: "#d03b3b",
  },
};

const dark: VizTheme = {
  surface: "#1a1a19",
  grid: "#2e2e2b",
  axis: "#93928a",
  series: ["#3987e5", "#d95926", "#199e70"],
  sequential: ["#9ec5f4", "#6da7ec", "#3987e5", "#256abf", "#184f95"],
  status: light.status,
};

/* The active mode lives in the DOM (the OS setting, or the `data-theme` stamp
   written by the toggle), so it is read as an external store rather than mirrored
   into component state. */
function subscribe(onChange: () => void) {
  const media = window.matchMedia("(prefers-color-scheme: dark)");
  media.addEventListener("change", onChange);

  const observer = new MutationObserver(onChange);
  observer.observe(document.documentElement, {
    attributes: true,
    attributeFilter: ["data-theme"],
  });

  return () => {
    media.removeEventListener("change", onChange);
    observer.disconnect();
  };
}

function getSnapshot() {
  const stamped = document.documentElement.dataset.theme;
  return stamped
    ? stamped === "dark"
    : window.matchMedia("(prefers-color-scheme: dark)").matches;
}

/** Server render has no colour scheme; light is the documented default. */
const getServerSnapshot = () => false;

export function useIsDark() {
  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}

export function useVizTheme(): { theme: VizTheme; isDark: boolean } {
  const isDark = useIsDark();
  return { theme: isDark ? dark : light, isDark };
}

export const invoiceStatusColor: Record<InvoiceStatus, keyof VizTheme["status"]> = {
  paid: "good",
  pending: "warning",
  overdue: "critical",
  draft: "serious",
};
