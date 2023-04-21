import sketch, { Library, SharedStyle } from "sketch";

/**
 * Récupère le style de calque de la bibliothèque de design-system avec le nom spécifié.
 *
 * @param {string} name - Le nom du style de calque à récupérer.
 * @returns {SharedStyle} Le style de calque importé.
 */
function getLibraryLayerStyle(name: string): SharedStyle | null {
  const library = ((sketch as any)
    .getLibraries() as Library[])
    .find((library) => library.name.includes("design-system"));

  const doc = sketch.getSelectedDocument();

  if (!doc || !library) {
    return null;
  }

  return library
    .getImportableLayerStyleReferencesForDocument(doc)
    .find((ref) => ref.name === name)
    .import();
}

export default getLibraryLayerStyle;