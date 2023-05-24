import { useFormikContext } from "formik";
import React, { FC } from "react";

import Input from "../Input";
import Select from "../Select";

import styles from "./AdvancedOptions.module.scss";
import Options from "../../types/options.types";

const AdvancedOptions: FC = () => {
  const formik = useFormikContext<Options>();

  return (
    <details className={styles["advanced-options"]}>
      <summary data-app-region="no-drag">Paramètres avancés</summary>

      <div className={styles["advanced-options-content"]}>
        <Input
          min="16"
          type="number"
          id="cellWidth"
          name="cellWidth"
          direction="vertical"
          label="Largeur des cellules :"
          value={formik.values["cellWidth"]}
          onChange={(value) => {
            formik.setFieldValue("cellWidth", value);
            formik.setFieldTouched("cellWidth");
          }}
        />

        <Input
          min="16"
          type="number"
          id="rowHeight"
          name="rowHeight"
          direction="vertical"
          label="Hauteur des lignes :"
          value={formik.values["rowHeight"]}
          onChange={(value) => {
            formik.setFieldValue("rowHeight", value);
            formik.setFieldTouched("rowHeight");
          }}
        />

        <Select
          label="Contenu des cellules"
          id="cellSymbolName"
          name="cellSymbolName"
          value={formik.values["cellSymbolName"]}
          onChange={(value) => {
            formik.setFieldValue("cellSymbolName", value);
            formik.setFieldTouched("cellSymbolName");
          }}
          options={[
            {
              label: "Dropdown list",
              value: "Table/Cell Content/Default/Dropdown list",
            },
            {
              label: "Text",
              value: "Table/Cell Content/Default/Text",
            },
          ]}
        />

        <Select
          id="cellStyleName"
          name="cellStyleName"
          label="Style des cellules"
          value={formik.values["cellStyleName"]}
          onChange={(value) => {
            formik.setFieldValue("cellStyleName", value);
            formik.setFieldTouched("cellStyleName");
          }}
          options={[
            {
              label: "Default",
              value: "Table/Cell/Default/Default",
            },
            {
              label: "Disabled",
              value: "Table/Cell/Default/Disabled",
            },
            {
              label: "Error",
              value: "Table/Cell/Default/Error",
            },
            {
              label: "Focus",
              value: "Table/Cell/Default/Focus",
            },
            {
              label: "Transparent",
              value: "Table/Cell/Default/Transparent",
            },
          ]}
        />
      </div>
    </details>
  );
};

AdvancedOptions.displayName = "AdvancedOptions";

export default AdvancedOptions;
