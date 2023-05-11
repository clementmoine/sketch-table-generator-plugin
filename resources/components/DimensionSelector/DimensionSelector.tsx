import React, { FC, useState, MouseEvent, useCallback, useMemo } from "react";
import classnames from "classnames";

import Input, { InputProps } from "../Input";

import styles from "./DimensionSelector.module.scss";

export interface DimensionSelectorProps {
  height?: number;
  width?: number;
}

const DimensionSelector: FC<DimensionSelectorProps> = (props) => {
  const [values, setValues] = useState<Record<string, string>>({});
  const [activeCell, setActiveCell] = useState<{
    row: number;
    col: number;
  } | null>(null);

  const handelMouseOut = useCallback(() => {
    setActiveCell(null);
  }, []);

  const handleClick = useCallback(() => {
    if (!activeCell) {
      return;
    }

    setValues({
      rowCount: (activeCell.row + 1).toString(),
      colCount: (activeCell.col + 1).toString(),
    });
  }, [activeCell]);

  const handleChange = useCallback<NonNullable<InputProps["onChange"]>>(
    (value, input) => {
      setValues((currentValue) => ({
        rowCount: currentValue.rowCount || "",
        colCount: currentValue.colCount || "",
        [input.name!]: value || "",
      }));
    },
    []
  );

  const handleMouseOver = useCallback(
    (event: MouseEvent<HTMLTableCellElement>) => {
      const cell = event.currentTarget;

      setActiveCell({
        row: Number(cell.dataset.row),
        col: Number(cell.dataset.col),
      });
    },
    []
  );

  const rows = useMemo(() => {
    const newRows: JSX.Element[] = [];

    for (let rowId = 0; rowId < (props.height || 0); rowId++) {
      const cells = [];

      for (let colId = 0; colId < (props.width || 0); colId++) {
        cells.push(
          <td
            key={`${rowId}-${colId}`}
            data-col={colId}
            data-row={rowId}
            className={classnames(styles["dimension-selector-table-cell"], {
              [styles["dimension-selector-table-cell--is-active"]]:
                activeCell &&
                activeCell?.col >= colId &&
                activeCell?.row >= rowId,
              [styles["dimension-selector-table-cell--is-selected"]]:
                values.colCount &&
                values.rowCount &&
                Number(values.colCount) - 1 >= colId &&
                Number(values.rowCount) - 1 >= rowId,
            })}
            onMouseOver={handleMouseOver}
          >
            <button
              type="button"
              className={styles["dimension-selector-table-cell-button"]}
            ></button>
          </td>
        );
      }

      newRows.push(
        <tr key={rowId} data-row={rowId}>
          {cells}
        </tr>
      );
    }

    return newRows;
  }, [activeCell, props.height, props.width, values]);

  return (
    <div className={styles["dimension-selector"]} data-app-region="no-drag">
      <table
        className={styles["dimension-selector-table"]}
        onMouseLeave={handelMouseOut}
        onClick={handleClick}
      >
        <caption
          className={styles["dimension-selector-table-caption"]}
          data-app-region="drag"
        >
          {activeCell
            ? `Tableau ${activeCell.row + 1}x${activeCell.col + 1}`
            : values.rowCount && values.colCount
            ? `Tableau ${values.rowCount}x${values.colCount}`
            : "Insérer un tableau"}
        </caption>

        {rows}
      </table>

      <Input
        required
        min={1}
        type="number"
        name="rowCount"
        max={props.height}
        onChange={handleChange}
        value={values["rowCount"]}
        className={styles['dimension-selector-input']}
      />
      <Input
        required
        min={1}
        type="number"
        name="colCount"
        max={props.width}
        onChange={handleChange}
        value={values["colCount"]}
        className={styles['dimension-selector-input']}
      />
    </div>
  );
};

DimensionSelector.defaultProps = {
  width: 10,
  height: 8,
};

DimensionSelector.displayName = "DimensionSelector";

export default DimensionSelector;
