
/**
 * @module utils
 */

/**
 * Sort the characters
 * @name collator
 * @type {Intl.Collator} 
 */
const collator = new Intl.Collator(undefined, {
  numeric: true,
  sensitivity: "base",
});

/**
 * A sorter function that run the collector compare function {@link collator}
 * @param {string} a - A string compare with b
 * @param {string} b - A string compare with a
 * @returns {number} - It's a one or minus one or zero
 * @version 1.0.0
 */
export function sorter(a, b) {
  if (a === 'all', b === 'all') return 1

  return collator.compare(a, b)
}

