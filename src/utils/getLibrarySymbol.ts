import sketch, { SymbolMaster, Library } from "sketch";

/**
 * Récupère le symbole de la bibliothèque de design-system avec le nom spécifié.
 *
 * @param {string} name - Le nom du symbole à récupérer.
 * @returns {SymbolMaster} Le symbole importé.
 */
function getLibrarySymbol(name: string): SymbolMaster | null {
  const library = ((sketch as any).getLibraries() as Library[]).find(
    (library: Library) => library.name.includes("design-system")
  );

  const doc = sketch.getSelectedDocument();

  if (!doc || !library) {
    return null;
  }

  return library
    .getImportableSymbolReferencesForDocument(doc)
    .find((ref) => ref.name === name)
    .import();
}

export default getLibrarySymbol;
