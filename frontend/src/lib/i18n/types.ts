/* ---------------------------------------------------------------------------
   The type layer that makes the catalogues checkable:

   • `MessageKeys` turns the English catalogue into the union of its dotted
     paths, so `t("customers.columns.name")` autocompletes and a typo is a
     compile error rather than a string that silently renders as its own key.
   • `Mirror` maps that catalogue onto the shape every other language must
     have, so a missing Arabic key fails `tsc` instead of falling back at
     runtime unnoticed.
--------------------------------------------------------------------------- */

/**
 * A message with plural forms. `other` is the only required category — it is
 * the fallback for every category a language does not use. English needs
 * `one`/`other`; Arabic may use all six.
 */
export type PluralMessage = {
  zero?: string;
  one?: string;
  two?: string;
  few?: string;
  many?: string;
  other: string;
};

export type MessageValue = string | PluralMessage;

export type MessageTree = {
  readonly [key: string]: MessageValue | MessageTree;
};

/* A leaf is a plain string or a plural table. Namespaces are never mistaken for
   plural tables because a plural table must carry `other`, which no namespace
   in the catalogue uses as a key. */
type IsLeaf<T> = T extends string ? true : T extends PluralMessage ? true : false;

/** `{ nav: { customers: "…" } }` → `"nav.customers"`. */
export type MessageKeys<T> = {
  [K in keyof T & string]: IsLeaf<T[K]> extends true
    ? K
    : `${K}.${MessageKeys<T[K]>}`;
}[keyof T & string];

/**
 * The English catalogue with its literal types widened: strings stay strings,
 * plural tables accept any subset of categories. This is the contract other
 * languages implement.
 */
export type Mirror<T> = T extends string
  ? string
  : T extends PluralMessage
    ? PluralMessage
    : { [K in keyof T]: Mirror<T[K]> };

/** Values substituted into `{placeholder}` slots. Numbers are locale-formatted. */
export type TranslationVars = Record<string, string | number>;
