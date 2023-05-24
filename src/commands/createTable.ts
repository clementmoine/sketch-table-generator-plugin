import UI from "sketch/ui";
import { Group } from "sketch/dom";
import sketch, { Settings } from "sketch";
import BrowserWindow from "sketch-module-web-view";
// @ts-ignore
import { isWebviewPresent, sendToWebview } from "sketch-module-web-view/remote";

import getLibraryLayerStyle from "../utils/getLibraryLayerStyle";
import getLibrarySymbol from "../utils/getLibrarySymbol";
import pluralize from "../utils/pluralize";

import { webviewId } from "../config";

import Options from "../../resources/types/options.types";
import { defaultOptions } from "../../resources/types/options.defaults";

export default function () {
  const browserWindow = new BrowserWindow({
    identifier: webviewId,
    show: false,
    width: 280,
    height: 504,
    frame: false,
    center: true,
    resizable: false,
    alwaysOnTop: true,
    hidesOnDeactivate: true,
  });

  // only show the window when the page has loaded to avoid a white flash
  browserWindow.once("ready-to-show", () => {
    browserWindow.show();
  });

  // Close the modal on blur (not in dev mode)
  browserWindow.on("blur", () => {
    if (process.env.NODE_ENV !== "development") {
      browserWindow.close();
    }
  });

  // Reload the modal on focus in dev mode
  browserWindow.on("focus", () => {
    if (process.env.NODE_ENV === "development") {
      browserWindow.reload();
    }
  });

  // Handle messages from the webview
  browserWindow.webContents.on("submit", (rawOptions) => {
    const options = JSON.parse(rawOptions);
    
    (options.mode === "edit" ? editTable : createTable)(options).then(browserWindow.close);
  });

  // Handle the update selection asked from the webview
  browserWindow.webContents.on("updateContext", () => {
    onContextChanged();
  });

  browserWindow.webContents.on("cancel", () => {
    browserWindow.close();
  });

  browserWindow.webContents.on("resize", (newHeight: string) => {
    const [, height] = browserWindow.getSize();
    const [x, y] = browserWindow.getPosition();

    // Resize the window
    browserWindow.setSize(browserWindow.getSize()[0], Number(newHeight), false);

    // Adjust the window position to keep a consistent x and y position
    browserWindow.setPosition(x, y + Number(newHeight) - height, false);
  });

  browserWindow.loadURL(require("../../resources/webview.html"));
}

// Listen the selection change
export function onContextChanged() {
  if (isWebviewPresent(webviewId)) {
    // Get the currently selected document
    const doc = sketch.getSelectedDocument();

    // Try to get the currently selected table
    const selectedTable = doc?.selectedLayers.layers.find((layer) => {
      return sketch.Settings.layerSettingForKey(layer, "type") === "table";
    });

    if (!selectedTable) {
      // Send the selected table to the webview
      sendToWebview(webviewId, `setSelectedTable(undefined)`);

      return;
    }

    // Send the selected table to the webview
    sendToWebview(webviewId, `setSelectedTable("${selectedTable.id}")`);

    // Try to get the options from the selected table
    const options = sketch.Settings.layerSettingForKey(
      selectedTable,
      "options"
    );

    if (!options) {
      return;
    }

    // Send the options to the webview
    sendToWebview(webviewId, `setOptions(${JSON.stringify(options)})`);
  }
}

// When the plugin is shutdown by Sketch (for example when the user disable the plugin)
// we need to close the webview if it's open
export function onShutdown() {
  const existingWebview = BrowserWindow.fromId(webviewId);

  if (existingWebview) {
    existingWebview.close();
  }
}

/**
 * Edit an existing table
 * 
 * @async
 * @param {Options} options - Table options 
 */
async function editTable(options: Options = defaultOptions): Promise<void> {
  const {
    mode = defaultOptions.mode,
    libraryName = defaultOptions.libraryName,
    rowHeight = defaultOptions.rowHeight,
    rowCount = defaultOptions.rowCount,
    colCount = defaultOptions.colCount,
    cellWidth = defaultOptions.cellWidth,
    rowPadding = defaultOptions.rowPadding,
    colGap = defaultOptions.colGap,
    cellStyleName = defaultOptions.cellStyleName,
    cellSymbolName = defaultOptions.cellSymbolName,
    groupBy = defaultOptions.groupBy,
  } = options;
  
  // Get the currently selected document
  const doc = sketch.getSelectedDocument();

  // Parse the selected table to take every overrides that needs to be kept
  // Once we parsed table data we will re-create this table with new options
}

/**
 * Create a new table
 *
 * @async
 * @param {Options} options - Table options
 */
async function createTable(options: Options = defaultOptions): Promise<void> {
  const {
    mode = defaultOptions.mode,
    libraryName = defaultOptions.libraryName,
    rowHeight = defaultOptions.rowHeight,
    rowCount = defaultOptions.rowCount,
    colCount = defaultOptions.colCount,
    cellWidth = defaultOptions.cellWidth,
    rowPadding = defaultOptions.rowPadding,
    colGap = defaultOptions.colGap,
    cellStyleName = defaultOptions.cellStyleName,
    cellSymbolName = defaultOptions.cellSymbolName,
    groupBy = defaultOptions.groupBy,
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
    getLibrarySymbol(libraryName, "Table/Row/Standard"),
    getLibrarySymbol(libraryName, "Table/Cell/Default"),
    getLibrarySymbol(libraryName, "Table/Header Label/Left/Default"),
    getLibrarySymbol(libraryName, cellSymbolName),
    getLibraryLayerStyle(libraryName, cellStyleName),
    getLibraryLayerStyle(libraryName, "Table/Row/_Odd (impair)"),
    getLibraryLayerStyle(libraryName, "Table/Row/_Even (pair)"),
  ]);

  if (
    !doc ||
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

  // Create a group for the table
  const tableGroup = new Group({
    name: "Table",
    parent: doc.selectedPage as any,
  });

  // Create a group for the header
  const headerGroup = new Group({
    name: "Header",
    parent: tableGroup,
  });

  // Create the table header
  const headerRow = TableRowStandard.createNewInstance();
  headerRow.frame.height = Number(rowHeight);
  headerRow.frame.x = -Number(rowPadding);
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

    const labelOverride = headerLabel.overrides.find(
      (override) =>
        override.property === "stringValue" &&
        override.affectedLayer.name.includes("Label")
    );

    if (!labelOverride) {
      return;
    }

    labelOverride.value = `En-tête ${i + 1}`;
  }

  headerRow.frame.width =
    Number(colCount) * (Number(cellWidth) + Number(colGap)) -
    Number(colGap) +
    2 * Number(rowPadding);

  const rowsGroup = new Group({
    name: "Rows",
    parent: tableGroup,
  });

  // Create the table rows
  for (let i = 0; i < Number(rowCount); i++) {
    const rowGroup = new Group({
      name: `Row ${i + 1}`,
      parent: rowsGroup,
    });

    const row = TableRowStandard.createNewInstance();
    row.frame.x = -Number(rowPadding);
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

    // Create the cells
    for (let j = 0; j < Number(colCount); j++) {
      const cell = TableCellDefault.createNewInstance();
      cell.parent = cellsGroup;
      cell.frame.width = Number(cellWidth);
      cell.frame.y = row.frame.y + (row.frame.height - cell.frame.height) / 2;
      cell.frame.x = j * (cell.frame.width + Number(colGap)); // Ajoute un espace de 16px entre chaque cellule

      // Affect the cell symbol
      const tableCellSymbolOverride = cell.overrides.find(
        (override) =>
          override.property === "symbolID" &&
          override.affectedLayer.name.includes("Table/Cell Content/Default")
      );

      if (tableCellSymbolOverride) {
        tableCellSymbolOverride.value = TableCellSymbol.symbolId;
      }

      // Affect the cell style
      const tableCellLayerStyleOverride = cell.overrides.find(
        (override) =>
          (override.property as string) === "layerStyle" &&
          override.affectedLayer.name === "Cell style"
      );

      if (tableCellLayerStyleOverride) {
        tableCellLayerStyleOverride.value = TableCellLayerStyle.id;
      }

      // Affect the cell value
      const tableCellValueOverride = cell.overrides.find(
        (override) =>
          (override.property as string) === "stringValue" &&
          override.affectedLayer.name.match(/text/i)
      );

      if (tableCellValueOverride) {
        tableCellValueOverride.value = `Cellule ${i + 1}:${j + 1}`;
      }
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

  const selectedLayer =
    doc.selectedLayers.layers[doc.selectedLayers.layers.length - 1];

  if (selectedLayer) {
    // Insert the table top 0px from the current selection and 100px right
    tableGroup.frame.x =
      selectedLayer.frame.x + selectedLayer.frame.width + 100;
    tableGroup.frame.y = selectedLayer.frame.y;
  }

  // Clear selected layers
  doc.selectedLayers.clear();

  // Select the table
  tableGroup.selected = true;

  // Center on the table
  doc.centerOnLayer(tableGroup);

  // Keep settings on the create table to permit editing
  Settings.setLayerSettingForKey(tableGroup, "type", "table");
  Settings.setLayerSettingForKey(tableGroup, "options", options);

  // Display a message to confirm the table creation
  UI.message(
    `Tableau de ${pluralize(Number(rowCount), "ligne")} et ${pluralize(
      Number(colCount),
      "colonne"
    )} inséré dans le document ! 👍`
  );
}
