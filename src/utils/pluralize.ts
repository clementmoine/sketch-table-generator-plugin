/**
 * Ajoute un suffixe pluriel à un nom de nom si nécessaire.
 *
 * @param {number} count - Le nombre d'éléments.
 * @param {string} noun - Le nom de l'élément.
 * @param {string} [suffix=s] - Le suffixe à ajouter pour former le pluriel.
 * @returns {string} Le nom de l'élément avec le suffixe pluriel ajouté si nécessaire.
 */
const pluralize = (count: number, noun: string, suffix = "s"): string =>
  `${count} ${noun}${count !== 1 ? suffix : ""}`;

export default pluralize;