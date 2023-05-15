import sketch, { SymbolMaster, Library } from "sketch";

import Options from "../../resources/types/options.types";

/**
 * Get a symbol from the given library with the name
 */
function getLibrarySymbol(libraryName?: Options['libraryName'], name?: string): SymbolMaster | null {
  if (!libraryName && !name) {
    return null;
  }

  const library = ((sketch as any).getLibraries() as Library[]).find(
    (library: Library) => library.name.match("design-system")
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
