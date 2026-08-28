/* ---------------------------------------------------------------------------
   Locale registry. Everything locale-dependent that is *not* a translated
   string lives here: writing direction, the BCP-47 tag handed to `Intl`, and
   the font token. Adding a language means adding an entry here plus a message
   catalogue in ./messages — nothing else in the app hardcodes a locale.
--------------------------------------------------------------------------- */

export const locales = ["en", "ar"] as const;

export type Locale = (typeof locales)[number];

export type Direction = "ltr" | "rtl";

/** English is the source language: every key exists here first. */
export const defaultLocale: Locale = "en";

/** Read on the server in the root layout, written by the client switcher. */
export const LOCALE_COOKIE = "erp-locale";
export const LOCALE_COOKIE_MAX_AGE = 60 * 60 * 24 * 365;

/** Business currency, not a locale property — only its formatting is localised. */
export const CURRENCY = "SAR";

export type LocaleMeta = {
  /** Endonym, shown in the language switcher in its own language. */
  label: string;
  /** Same name in English, for `aria-label` on the switcher. */
  englishLabel: string;
  dir: Direction;
  /** Value for the `lang` attribute. */
  htmlLang: string;
  /**
   * Tag passed to `Intl` and `Intl.PluralRules`. Arabic pins `nu-latn`: Latin
   * digits are easier to scan in tables and charts, and they keep column widths
   * identical between the two languages.
   */
  intlLocale: string;
  /** CSS variable holding the font family that covers this script. */
  fontVariable: string;
};

export const localeMeta: Record<Locale, LocaleMeta> = {
  en: {
    label: "English",
    englishLabel: "English",
    dir: "ltr",
    htmlLang: "en",
    intlLocale: "en-US",
    fontVariable: "--font-inter",
  },
  ar: {
    label: "العربية",
    englishLabel: "Arabic",
    dir: "rtl",
    htmlLang: "ar",
    intlLocale: "ar-SA-u-nu-latn",
    fontVariable: "--font-cairo",
  },
};

export const isLocale = (value: unknown): value is Locale =>
  typeof value === "string" && (locales as readonly string[]).includes(value);

/**
 * Narrows any untrusted string (cookie, `Accept-Language`, query param) to a
 * supported locale. Region subtags are matched on their language prefix, so
 * `ar-SA` and `ar-EG` both resolve to `ar`.
 */
export function resolveLocale(value: string | null | undefined): Locale {
  if (!value) return defaultLocale;

  const normalised = value.trim().toLowerCase();
  if (isLocale(normalised)) return normalised;

  const language = normalised.split(/[-_]/)[0];
  return isLocale(language) ? language : defaultLocale;
}

export const directionOf = (locale: Locale): Direction => localeMeta[locale].dir;
