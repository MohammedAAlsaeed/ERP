import { defaultLocale, localeMeta, type Locale } from "./config";
import { catalogues, type Messages, type TranslationKey } from "./messages";
import type { MessageValue, PluralMessage, TranslationVars } from "./types";

/* ---------------------------------------------------------------------------
   The translator: key lookup → plural selection → interpolation.

   Resolution order for a key is (1) the active catalogue, (2) the English
   catalogue, (3) the key itself. Step 2 keeps a half-finished translation
   usable; step 3 makes the gap obvious in the UI instead of rendering blank,
   and warns once in development.
--------------------------------------------------------------------------- */

const PLACEHOLDER = /\{(\w+)\}/g;

const isPlural = (value: MessageValue): value is PluralMessage =>
  typeof value === "object" && value !== null && "other" in value;

/** Walks a dotted path; returns undefined rather than throwing on a bad key. */
function lookup(messages: Messages, key: string): MessageValue | undefined {
  let node: unknown = messages;

  for (const segment of key.split(".")) {
    if (typeof node !== "object" || node === null) return undefined;
    node = (node as Record<string, unknown>)[segment];
  }

  return typeof node === "string" || (node !== undefined && isPlural(node as MessageValue))
    ? (node as MessageValue)
    : undefined;
}

/**
 * Picks a plural form. `zero` is honoured for an exact count of 0 even in
 * languages whose plural rules have no `zero` category — "no records" reads
 * better than "0 records" — then falls back to the category `Intl` selected,
 * then to `other`.
 */
function selectPlural(
  message: PluralMessage,
  count: number,
  rules: Intl.PluralRules,
): string {
  if (count === 0 && message.zero !== undefined) return message.zero;
  return message[rules.select(count)] ?? message.other;
}

function interpolate(
  template: string,
  vars: TranslationVars | undefined,
  numbers: Intl.NumberFormat,
): string {
  if (!vars) return template;

  return template.replace(PLACEHOLDER, (match, name: string) => {
    const value = vars[name];
    if (value === undefined) return match;
    return typeof value === "number" ? numbers.format(value) : value;
  });
}

const warned = new Set<string>();

function warnOnce(message: string) {
  if (process.env.NODE_ENV === "production" || warned.has(message)) return;
  warned.add(message);
  console.warn(`[i18n] ${message}`);
}

export type Translator = {
  /** Typed lookup — a key that is not in the catalogue is a compile error. */
  (key: TranslationKey, vars?: TranslationVars): string;
  locale: Locale;
  /** Whether a runtime-built key exists in the active or fallback catalogue. */
  has: (key: string) => boolean;
  /**
   * Lookup for keys assembled at runtime — an error `code` from the API, a
   * validation message carried by a zod schema. Unknown keys are returned
   * unchanged, so a plain sentence passes through as itself.
   */
  dynamic: (key: string, vars?: TranslationVars) => string;
};

const cache = new Map<Locale, Translator>();

/**
 * Translators are pure and depend only on the locale, so they are memoised.
 * The stable identity matters: components memoise derived work (table columns,
 * for one) on `t`, and a fresh function every render would defeat that.
 */
export function createTranslator(locale: Locale): Translator {
  const cached = cache.get(locale);
  if (cached) return cached;

  const messages = catalogues[locale];
  const fallback = catalogues[defaultLocale];
  const { intlLocale } = localeMeta[locale];
  const rules = new Intl.PluralRules(intlLocale);
  const numbers = new Intl.NumberFormat(intlLocale);

  const resolve = (key: string): MessageValue | undefined => {
    const own = lookup(messages, key);
    if (own !== undefined) return own;

    const inherited = lookup(fallback, key);
    if (inherited !== undefined) {
      warnOnce(`missing "${key}" in "${locale}" — falling back to "${defaultLocale}"`);
      return inherited;
    }

    return undefined;
  };

  const render = (key: string, vars?: TranslationVars): string => {
    const message = resolve(key);

    if (message === undefined) {
      warnOnce(`unknown key "${key}"`);
      return key;
    }

    const template = isPlural(message)
      ? selectPlural(message, Number(vars?.count ?? 0), rules)
      : message;

    return interpolate(template, vars, numbers);
  };

  const translator = ((key: TranslationKey, vars?: TranslationVars) =>
    render(key, vars)) as Translator;

  translator.locale = locale;
  translator.has = (key: string) => resolve(key) !== undefined;
  translator.dynamic = (key: string, vars?: TranslationVars) =>
    translator.has(key) ? render(key, vars) : key;

  cache.set(locale, translator);
  return translator;
}
