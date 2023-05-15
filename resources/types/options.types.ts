/**
 * Options for configuring the table generation.
 */
type Options = {
    /**
     * Library name to find each symbols and styles.
     */
    libraryName?: string | RegExp;

    /**
     * The height of each row. Can be a number or a string.
     */
    rowHeight?: number | string;
    
    /**
     * The total number of rows. Can be a number or a string.
     */
    rowCount?: number | string;
    
    /**
     * The total number of columns. Can be a number or a string.
     */
    colCount?: number | string;
    
    /**
     * The width of each cell. Can be a number or a string.
     */
    cellWidth?: number | string;
    
    /**
     * The padding applied to each row. Can be a number or a string.
     */
    rowPadding?: number | string;
    
    /**
     * The gap between columns. Can be a number or a string.
     */
    colGap?: number | string;
    
    /**
     * The name of the style applied to each cell.
     */
    cellStyleName?: string;
    
    /**
     * The name of the symbol used for each cell.
     */
    cellSymbolName?: string;
    
    /**
     * Indicates whether to group data by column.
     */
    groupByColumn?: boolean;
};
  
export default Options;
