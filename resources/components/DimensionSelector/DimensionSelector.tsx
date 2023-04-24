import React, { FC, useEffect, useState, MouseEvent, useCallback } from "react";
import classnames from "classnames";

import styles from "./DimensionSelector.module.scss";

const SELECTOR_HEIGHT = 8;
const SELECTOR_WIDTH = 10;

const DimensionSelector: FC = () => {
  const [values, setValues] = useState<Record<string, string>>({});
  const [rows, setRows] = useState<JSX.Element[] | null>(null);
  const [activeCell, setActiveCell] = useState<{
    row: number;
    col: number;
  } | null>(null);

  useEffect(() => {
    function createRows() {
      const newRows: JSX.Element[] = [];

      for (let rowId = 0; rowId < SELECTOR_HEIGHT; rowId++) {
        const cells = [];
        for (let colId = 0; colId < SELECTOR_WIDTH; colId++) {
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

      setRows(newRows);
    }

    createRows();
  }, [activeCell, values]);

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

  const handleMouseOver = (event: MouseEvent<HTMLTableCellElement>) => {
    const cell = event.currentTarget;

    setActiveCell({
      row: Number(cell.dataset.row),
      col: Number(cell.dataset.col),
    });
  };

  return (
    <div className={styles["dimension-selector"]}>
      <table
        className={styles["dimension-selector-table"]}
        onMouseLeave={handelMouseOut}
        onClick={handleClick}
      >
        <caption className={styles["dimension-selector-table-caption"]}>
          {activeCell
            ? `Tableau ${activeCell.row + 1}x${activeCell.col + 1}`
            : values.rowCount && values.colCount
            ? `Tableau ${values.rowCount}x${values.colCount}`
            : "Insérer un tableau"}
        </caption>

        {rows}
      </table>

      <input name="rowCount" type="number" hidden value={values["rowCount"]} />
      <input name="colCount" type="number" hidden value={values["colCount"]} />
    </div>
  );
};

DimensionSelector.displayName = "DimensionSelector";

export default DimensionSelector;
