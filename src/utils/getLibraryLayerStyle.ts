import sketch, { Library, SharedStyle } from "sketch";

import Options from "../../resources/types/options.types";

/**
 * Get a layer style from the given library with the name
 * 
 * @todo Handle the library name to be undefined and use only local components
 */
function getLibraryLayerStyle(libraryName?: Options['libraryName'], name?: string): SharedStyle {
  if (!libraryName || !name) {
    throw null;
  }

  const library = ((sketch as any)
    .getLibraries() as Library[])
    .find((library) => library.name.includes("design-system"));

  const doc = sketch.getSelectedDocument();

  if (!doc || !library) {
    throw null;
  }

  return library
    .getImportableLayerStyleReferencesForDocument(doc)
    .find((ref) => ref.name === name)
    .import();
}

export default getLibraryLayerStyle;