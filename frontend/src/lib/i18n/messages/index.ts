import type { Locale } from "../config";
import type { MessageKeys } from "../types";

import { ar } from "./ar";
import { en, type Messages } from "./en";

/* Both catalogues are imported statically: together they are a few kilobytes,
   and a synchronous registry means `t` never needs to be awaited — the server
   can render a title and a client component can render a label with the same
   call. Swap these for `await import(...)` behind a per-locale loader if the
   catalogues ever grow enough to matter. */
export const catalogues: Record<Locale, Messages> = { en, ar };

/** Every valid dotted path, derived from the English catalogue. */
export type TranslationKey = MessageKeys<typeof en>;

export { en, ar };
export type { Messages };
