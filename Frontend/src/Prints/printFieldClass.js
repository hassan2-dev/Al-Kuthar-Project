/** Raw value has non-whitespace content (empty = show blank line). */
export function isFieldFilled(value) {
  return Boolean(String(value ?? "").trim());
}

/** Append `cp-field--filled` when value is filled — hides underline in print styles. */
export function fieldClass(baseClass, rawValue) {
  return isFieldFilled(rawValue) ? `${baseClass} cp-field--filled` : baseClass;
}
