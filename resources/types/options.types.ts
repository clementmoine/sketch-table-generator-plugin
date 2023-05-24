/**
 * Options for configuring the table generation.
 */
type Options = {
    /**
     * Insert mode for the table
     */
    mode?: 'new' | 'edit';
    /**
     * Library name to find each symbols and styles.
     */
    libraryName?: string | RegExp;

    /**
     * The height of each row. Can be a number or a string.
     */
    rowHeight?: string;
    
    /**
     * The total number of rows. Can be a number or a string.
     */
    rowCount?: string;
    
    /**
     * The total number of columns. Can be a number or a string.
     */
    colCount?: string;
    
    /**
     * The width of each cell. Can be a number or a string.
     */
    cellWidth?: string;
    
    /**
     * The padding applied to each row. Can be a number or a string.
     */
    rowPadding?: string;
    
    /**
     * The gap between columns. Can be a number or a string.
     */
    colGap?: string;
    
    /**
     * The name of the style applied to each cell.
     */
    cellStyleName?: string;
    
    /**
     * The name of the symbol used for each cell.
     */
    cellSymbolName?: string;
    
    /**
     * Indicates whether to group data by column or row.
     */
    groupBy?: 'column' | 'row';
};
  
export default Options;
