import UI from "sketch/ui";
import sketch from "sketch";
import { Page, Group } from "sketch/dom";
import BrowserWindow from "sketch-module-web-view";
import { getWebview } from "sketch-module-web-view/remote";

import getLibraryLayerStyle from "../utils/getLibraryLayerStyle";
import getLibrarySymbol from "../utils/getLibrarySymbol";
import pluralize from "../utils/pluralize";

const webviewIdentifier = "table-generator.webview";

export default function () {
  const options = {
    identifier: webviewIdentifier,
    show: false,
    width: 240,
    height: 218,
    frame: false,
    resizable: false,
    alwaysOnTop: true,
    hidesOnDeactivate: true,
  };

  const browserWindow = new BrowserWindow(options);

  // only show the window when the page has loaded to avoid a white flash
  browserWindow.once("ready-to-show", () => {
    browserWindow.show();
  });

  // close the modal on blur
  browserWindow.on("blur", () => {
    browserWindow.close();
  });

  // Handle messages from the webview
  browserWindow.webContents.on("nativeLog", (options) => {
    if (typeof options !== "object") {
      return;
    }

    createTable(options).then(browserWindow.close);
  });

  browserWindow.loadURL(require("../../resources/webview.html"));
}

/**
 * Créer une nouvelle table dans le document Sketch actif.
 *
 * @async
 * @param {Object} options - Les options de la table.
 * @param {number} [options.rowCount=1] - Le nombre de lignes de la table.
 * @param {number} [options.colCount=1] - Le nombre de colonnes de la table.
 * @param {number} [options.colWidth=200] - La largeur de chaque colonne.
 * @param {number} [options.rowPadding=16] - L'espace de remplissage entre les lignes.
 * @param {number} [options.colGap=16] - L'espace entre les colonnes.
 * @param {number} [options.groupByColumn=false] - Permet de regrouper les cellules par colonnes plutôt que par lignes
 */
async function createTable(options) {
  const {
    rowCount = 1,
    colCount = 1,
    colWidth = 200,
    rowPadding = 16,
    colGap = 16,
    groupByColumn = false,
  } = options;

  // Get the currently selected document
  const doc = sketch.getSelectedDocument();

  // Get the necessary symbols for table creation
  const [TableRowStandard, TableCellDefault, TableHeaderLabelLeftDefault] =
    await Promise.all([
      getLibrarySymbol("Table/Row/Standard"),
      getLibrarySymbol("Table/Cell/Default"),
      getLibrarySymbol("Table/Header Label/Left/Default"),
    ]);

  // Create a new page for the table
  const page = new Page({
    name: "Table",
    parent: doc,
  });

  // Create a group for the table
  const tableGroup = new Group({
    name: "Table",
    parent: page,
    selected: true,
  });

  // Create a group for the header
  const headerGroup = new Group({
    name: "Header",
    parent: tableGroup,
    selected: true,
  });

  // Create the table header
  const headerRow = TableRowStandard.createNewInstance();
  headerRow.frame.x = -rowPadding;
  headerRow.parent = headerGroup;

  // Create header labels
  for (let i = 0; i < colCount; i++) {
    const headerLabel = TableHeaderLabelLeftDefault.createNewInstance();

    headerLabel.parent = headerGroup;
    headerLabel.frame.width = colWidth;
    headerLabel.frame.y =
      headerRow.frame.y +
      (headerRow.frame.height - headerLabel.frame.height) / 2;
    headerLabel.frame.x = i * (headerLabel.frame.width + colGap); // Ajoute un espace de 16px entre chaque cellule

    const labelOverride = headerLabel.overrides.filter(
      (override) =>
        override.property === "stringValue" &&
        override.affectedLayer.name.includes("Label")
    )[0];

    labelOverride.value = `En-tête ${i + 1}`;
  }

  headerRow.frame.width =
    colCount * (colWidth + colGap) - colGap + 2 * rowPadding;

  // Create a group for the rows
  const rowsGroup = new Group({
    name: "Rows",
    parent: tableGroup,
    selected: true,
  });

  // Create the table rows
  for (let i = 0; i < rowCount; i++) {
    // Create a group for the row
    const rowGroup = new Group({
      name: `Row ${i + 1}`,
      parent: rowsGroup,
      selected: true,
    });

    const row = TableRowStandard.createNewInstance();
    row.frame.x = -rowPadding;
    row.frame.y = (i + 1) * row.frame.height;
    row.parent = rowGroup;

    // Set the row layer style override to "Table/Row/Odd" if odd or "Table/Row/Even" if even
    const rowStyleOverride = row.overrides.find(
      (override) =>
        override.property === "layerStyle" &&
        override.affectedLayer.name === "🎨 Background style"
    );

    const styleName =
      i % 2 === 0 ? "Table/Row/_Odd (impair)" : "Table/Row/_Even (pair)";
    const rowStyle = getLibraryLayerStyle(styleName);

    rowStyleOverride.value = rowStyle.id;

    const cellsGroup = new Group({
      name: `Cells`,
      parent: rowGroup,
      selected: true,
    });

    // Crée les cellules de la ligne
    for (let j = 0; j < colCount; j++) {
      const cell = TableCellDefault.createNewInstance();
      cell.parent = cellsGroup;
      cell.frame.width = colWidth;
      cell.frame.y = row.frame.y + (row.frame.height - cell.frame.height) / 2;
      cell.frame.x = j * (cell.frame.width + colGap); // Ajoute un espace de 16px entre chaque cellule
    }

    // Resize the row to fit the cols
    row.frame.width = colCount * (colWidth + colGap) - colGap + 2 * rowPadding;

    cellsGroup.adjustToFit();
    rowGroup.adjustToFit();
  }

  rowsGroup.adjustToFit();
  headerGroup.adjustToFit();
  tableGroup.adjustToFit();

  // Affiche un message pour confirmer la création de la table
  UI.message(
    `Tableau de ${pluralize(rowCount, "ligne")} et ${pluralize(
      colCount,
      "colonne"
    )} inséré dans le document ! 👍`
  );
}

// When the plugin is shutdown by Sketch (for example when the user disable the plugin)
// we need to close the webview if it's open
export function onShutdown() {
  const existingWebview = getWebview(webviewIdentifier);

  if (existingWebview) {
    existingWebview.close();
  }
}