import React, { FC, useEffect, useState, MouseEvent, useCallback } from "react";
import classnames from "classnames";

import styles from "./Generator.module.scss";

export interface GeneratorProps {
  rowCount: number;
  colCount: number;
}

const Generator: FC<GeneratorProps> = ({ rowCount, colCount }) => {
  const [rows, setRows] = useState<JSX.Element[] | null>(null);
  const [logs, setLogs] = useState<any>(null);
  const [activeCells, setActiveCells] = useState<number[][]>([]);

  useEffect(() => {
    console.log("create");

    function createRows() {
      const newRows: JSX.Element[] = [];

      for (let rowId = 0; rowId < rowCount; rowId++) {
        const cells = [];
        for (let colId = 0; colId < colCount; colId++) {
          cells.push(
            <td
              key={`${rowId}-${colId}`}
              data-col={colId}
              data-row={rowId}
              className={classnames(styles["generator-cell"], {
                [styles["generator-cell--is-active"]]:
                  activeCells?.[rowId]?.includes(colId),
              })}
              onMouseOver={handleMouseOver}
            >
              <button className={styles["generator-cell-button"]}></button>
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
  }, [rowCount, colCount, activeCells]);

  const resetGenerator = () => {
    // Reset generator logic
  };

  const handleClick = useCallback(() => {
    const rowCount = activeCells.length;
    const colCount = activeCells[0].length;

    window.postMessage(
      "nativeLog",
      JSON.stringify({
        rowCount,
        colCount,
      })
    );
  }, [activeCells]);

  const handleMouseOver = (event: MouseEvent<HTMLTableCellElement>) => {
    const cell = event.currentTarget;

    const rowIndex = Number(cell.dataset.row);
    const colIndex = Number(cell.dataset.col);

    const newActiveCells: number[][] = [];

    for (let i = 0; i <= rowIndex; i++) {
      const row: number[] = [];
      for (let j = 0; j <= colIndex; j++) {
        row.push(j);
      }
      newActiveCells.push(row);
    }

    setActiveCells(newActiveCells);
  };

  return (
    <>
      <table className={styles.generator} onClick={handleClick}>
        {rows}
      </table>

      <pre>{logs}</pre>
    </>
  );
};

Generator.displayName = "Generator";

export default Generator;
