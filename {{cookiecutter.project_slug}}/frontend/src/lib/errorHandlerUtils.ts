/**
 * Error-handling helpers. `getTranslation` is a small injectable fallback so the
 * module stays generic; wire your i18n store here if the generated app has one.
 */
let translate: (key: string, language?: string) => string = (key) => key;

export function setTranslate(fn: (key: string, language?: string) => string) {
  translate = fn;
}

export function getTranslation(key: string, language?: string) {
  return translate(key, language);
}

export function isAbortRejection(reason: unknown) {
  return reason instanceof DOMException && reason.name === "AbortError";
}

export function getErrorMessage(reason: unknown, fallback: string) {
  return reason instanceof Error ? reason.message : fallback;
}