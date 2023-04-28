import UI from "sketch/ui";
import sketch from "sketch";
import { Page, Group } from "sketch/dom";
import BrowserWindow from "sketch-module-web-view";

import getLibraryLayerStyle from "../utils/getLibraryLayerStyle";
import getLibrarySymbol from "../utils/getLibrarySymbol";
import pluralize from "../utils/pluralize";

const webviewIdentifier = "table-generator.webview";

export default function () {
  const options = {
    identifier: webviewIdentifier,
    show: false,
    width: 280,
    height: 384,
    frame: false,
    center: true,
    draggable: true,
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
  browserWindow.webContents.on("submit", (options) => {
    createTable(JSON.parse(options)).then(browserWindow.close);
  });

  browserWindow.webContents.on("cancel", () => {
    browserWindow.close();
  });

  browserWindow.webContents.on("resize", (height) => {
    browserWindow.setSize(options.width, Number(height), false);
  });

  browserWindow.loadURL(require("../../resources/webview.html"));
}

export type CreateTableOptions = {
  rowHeight?: number | string;
  rowCount?: number | string;
  colCount?: number | string;
  cellWidth?: number | string;
  rowPadding?: number | string;
  colGap?: number | string;
  cellStyleName?: string;
  cellSymbolName?: string;
  groupByColumn?: boolean;
};

/**
 * Créer une nouvelle table dans le document Sketch actif.
 *
 * @async
 * @param {Object} options - Les options de la table.
 * @param {number|string} [options.rowCount=1] - Le nombre de lignes de la table.
 * @param {number|string} [options.colCount=1] - Le nombre de colonnes de la table.
 * @param {number|string} [options.colWidth=200] - La largeur de chaque colonne.
 * @param {number|string} [options.rowPadding=16] - L'espace de remplissage entre les lignes.
 * @param {number|string} [options.colGap=16] - L'espace entre les colonnes.
 * @param {boolean} [options.groupByColumn=false] - Permet de regrouper les cellules par colonnes plutôt que par lignes
 */
async function createTable(options: CreateTableOptions): Promise<void> {
  const {
    colGap = 16,
    rowCount = 1,
    colCount = 1,
    rowHeight = 56,
    cellWidth = 200,
    rowPadding = 16,
    cellStyleName = "Table/Cell/Default/Transparent",
    cellSymbolName = "Table/Cell Content/Default/Text",
    groupByColumn = false,
  } = options;

  // Get the currently selected document
  const doc = sketch.getSelectedDocument();

  // Get the necessary symbols for table creation
  const [
    TableRowStandard,
    TableCellDefault,
    TableHeaderLabelLeftDefault,
    TableCellSymbol,
    TableCellLayerStyle,
    TableOddRowStyle,
    TableEventRowStyle,
  ] = await Promise.all([
    getLibrarySymbol("Table/Row/Standard"),
    getLibrarySymbol("Table/Cell/Default"),
    getLibrarySymbol("Table/Header Label/Left/Default"),
    getLibrarySymbol(cellSymbolName),
    getLibraryLayerStyle(cellStyleName),
    getLibraryLayerStyle("Table/Row/_Odd (impair)"),
    getLibraryLayerStyle("Table/Row/_Even (pair)"),
  ]);

  if (
    !TableRowStandard ||
    !TableCellDefault ||
    !TableHeaderLabelLeftDefault ||
    !TableCellSymbol ||
    !TableCellLayerStyle ||
    !TableOddRowStyle ||
    !TableEventRowStyle
  ) {
    return;
  }

  // Create a new page for the table
  const page = new Page({
    name: "Table",
    parent: doc,
  });

  // Create a group for the table
  const tableGroup = new Group({
    name: "Table",
    parent: page as any,
  });

  // Create a group for the header
  const headerGroup = new Group({
    name: "Header",
    parent: tableGroup,
  });

  // Create the table header
  const headerRow = TableRowStandard.createNewInstance();
  headerRow.frame.height = Number(rowHeight);
  headerRow.frame.x = -rowPadding;
  headerRow.parent = headerGroup;

  // Create header labels
  for (let i = 0; i < Number(colCount); i++) {
    const headerLabel = TableHeaderLabelLeftDefault.createNewInstance();

    headerLabel.parent = headerGroup;
    headerLabel.frame.width = Number(cellWidth);
    headerLabel.frame.y =
      headerRow.frame.y +
      (headerRow.frame.height - headerLabel.frame.height) / 2;
    headerLabel.frame.x = i * (headerLabel.frame.width + Number(colGap)); // Ajoute un espace de 16px entre chaque cellule

    const labelOverride = headerLabel.overrides.filter(
      (override) =>
        override.property === "stringValue" &&
        override.affectedLayer.name.includes("Label")
    )[0];

    labelOverride.value = `En-tête ${i + 1}`;
  }

  headerRow.frame.width =
    Number(colCount) * (Number(cellWidth) + Number(colGap)) -
    Number(colGap) +
    2 * Number(rowPadding);

  // Create a group for the rows
  const rowsGroup = new Group({
    name: "Rows",
    parent: tableGroup,
  });

  // Create the table rows
  for (let i = 0; i < Number(rowCount); i++) {
    // Create a group for the row
    const rowGroup = new Group({
      name: `Row ${i + 1}`,
      parent: rowsGroup,
    });

    const row = TableRowStandard.createNewInstance();
    row.frame.x = -rowPadding;
    row.frame.height = Number(rowHeight);
    row.frame.y = (i + 1) * row.frame.height;
    row.parent = rowGroup;

    // Set the row layer style override to "Table/Row/Odd" if odd or "Table/Row/Even" if even
    const rowStyleOverride = row.overrides.find(
      (override) =>
        (override.property as string) === "layerStyle" &&
        override.affectedLayer.name === "🎨 Background style"
    );

    if (rowStyleOverride) {
      rowStyleOverride.value = (
        i % 2 === 0 ? TableOddRowStyle : TableEventRowStyle
      ).id;
    }

    const cellsGroup = new Group({
      name: `Cells`,
      parent: rowGroup,
    });

    // Crée les cellules de la ligne
    for (let j = 0; j < Number(colCount); j++) {
      const cell = TableCellDefault.createNewInstance();
      cell.parent = cellsGroup;
      cell.frame.width = Number(cellWidth);
      cell.frame.y = row.frame.y + (row.frame.height - cell.frame.height) / 2;
      cell.frame.x = j * (cell.frame.width + Number(colGap)); // Ajoute un espace de 16px entre chaque cellule

      cell.overrides.forEach((override) => {
        // Affect the CellSymbol to override
        if (
          override.property === "symbolID" &&
          override.affectedLayer.name.includes("Table/Cell Content/Default")
        ) {
          override.value = TableCellSymbol.symbolId;

          return;
        }

        if (
          (override.property as string) === "layerStyle" &&
          override.affectedLayer.name === "Cell style"
        ) {
          override.value = TableCellLayerStyle.id;

          return;
        }
      });
    }

    // Resize the row to fit the cols
    row.frame.width =
      Number(colCount) * (Number(cellWidth) + Number(colGap)) -
      Number(colGap) +
      2 * Number(rowPadding);

    cellsGroup.adjustToFit();
    rowGroup.adjustToFit();
  }

  rowsGroup.adjustToFit();
  headerGroup.adjustToFit();
  tableGroup.adjustToFit();

  // Affiche un message pour confirmer la création de la table
  UI.message(
    `Tableau de ${pluralize(Number(rowCount), "ligne")} et ${pluralize(
      Number(colCount),
      "colonne"
    )} inséré dans le document ! 👍`
  );
}

// When the plugin is shutdown by Sketch (for example when the user disable the plugin)
// we need to close the webview if it's open
export function onShutdown() {
  const existingWebview = BrowserWindow.fromId(webviewIdentifier);

  if (existingWebview) {
    existingWebview.close();
  }
}
