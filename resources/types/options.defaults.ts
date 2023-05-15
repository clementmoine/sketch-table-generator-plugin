import Options from "./options.types";

/**
 * Default values for the options.
 */
export const defaultOptions: Options = {
  libraryName: /^design-system/,
  colGap: 16,
  rowCount: 1,
  colCount: 1,
  rowHeight: 56,
  cellWidth: 200,
  rowPadding: 16,
  cellStyleName: "Table/Cell/Default/Transparent",
  cellSymbolName: "Table/Cell Content/Default/Text",
  groupByColumn: false,
};