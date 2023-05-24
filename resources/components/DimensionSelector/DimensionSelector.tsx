import classnames from "classnames";
import { useFormikContext } from "formik";
import React, { FC, useState, MouseEvent, useCallback, useMemo } from "react";

import Input, { InputProps } from "../Input";

import Options from "../../types/options.types";

import styles from "./DimensionSelector.module.scss";

export interface DimensionSelectorProps {
  height?: number;
  width?: number;
}

const DimensionSelector: FC<DimensionSelectorProps> = (props) => {
  const formik = useFormikContext<Options>();

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

    formik.setValues((values) => ({
      ...values,
      rowCount: (activeCell.row + 1).toString(),
      colCount: (activeCell.col + 1).toString(),
    }));
    
    formik.setFieldTouched("rowCount");
    formik.setFieldTouched("colCount");
  }, [activeCell]);

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
                formik.values.colCount &&
                formik.values.rowCount &&
                Number(formik.values.colCount) - 1 >= colId &&
                Number(formik.values.rowCount) - 1 >= rowId,
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
  }, [activeCell, props.height, props.width, formik]);

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
            : Number(formik.values.rowCount) && Number(formik.values.colCount)
            ? `Tableau ${formik.values.rowCount}x${formik.values.colCount}`
            : "Insérer un tableau"}
        </caption>

        {rows}
      </table>

      <Input
        required
        min={1}
        type="number"
        name="rowCount"
        value={formik.values.rowCount}
        max={props.height || 0}
        className={styles["dimension-selector-input"]}
        onChange={(value) => {
          formik.setFieldValue("rowCount", value);
          formik.setFieldTouched("rowCount");
        }}
      />
      <Input
        required
        min={1}
        type="number"
        name="colCount"
        max={props.width || 0}
        value={formik.values.colCount}
        className={styles["dimension-selector-input"]}
        onChange={(value) => {
          formik.setFieldValue("colCount", value);
          formik.setFieldTouched("colCount");
        }}
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
