import React, { FC, ForwardedRef, forwardRef, useEffect, useRef } from "react";
import classNames from "classnames";
import { useFormikContext } from "formik";

import Options from "../../types/options.types";

import Switch from "../Switch";
import DimensionSelector from "../DimensionSelector";

import styles from "./Form.module.scss";
import RadioGroup from "../RadioGroup";
import Separator from "../Separator";
import AdvancedOptions from "../AdvancedOptions";
import Button from "../Button";
import { useSketchContext } from "../../context/SketchContext";
import { defaultOptions } from "../../types/options.defaults";

export interface FormProps {
  className?: string;
}

const Form = forwardRef<HTMLFormElement, FormProps>((props, ref) => {
  const { className } = props;

  const sketchContext = useSketchContext();

  const formik = useFormikContext<Options>();

  useEffect(() => {
    Object.keys(sketchContext.options).forEach((field) => {
      // Set default values to each fields if not touched and mode is edit
      if (!formik.touched[field as keyof Options]) {
        let newValue = sketchContext.selectedTable
          ? sketchContext.options[field as keyof Options]
          : defaultOptions[field as keyof Options];

        // Change the mode of depending on selected table
        if (field === "mode") {
          newValue = sketchContext.selectedTable ? "edit" : "new";
        }

        formik.setFieldValue(field, newValue);
      }
    });
  }, [sketchContext]);

  return (
    <form
      ref={ref}
      onReset={formik.handleReset}
      onSubmit={formik.handleSubmit}
      className={classNames(styles["form"], className)}
    >
      <main className={styles["form__body"]}>
        <DimensionSelector />

        <Switch
          label="Grouper par :"
          value={formik.values.groupBy}
          options={[
            { label: "Lignes", value: "row" },
            {
              label: "Colonnes",
              value: "column",
            },
          ]}
          onChange={(value) => {
            formik.setFieldValue("groupBy", value);
            formik.setFieldTouched("groupBy");
          }}
        />

        <RadioGroup
          name="mode"
          value={formik.values.mode}
          options={[
            {
              label: "Nouveau tableau",
              value: "new",
            },
            {
              label: "Tableau existant",
              value: "edit",
              disabled: !sketchContext.selectedTable,
            },
          ]}
          onChange={(value) => {
            formik.setFieldValue("mode", value);
            formik.setFieldTouched("mode");
          }}
        />

        <Separator />

        <AdvancedOptions />
      </main>

      <footer className={styles["form__footer"]}>
        <Button type="reset" label="Annuler" />
        <Button
          type="submit"
          disabled={formik.isSubmitting}
          label={formik.values.mode === "edit" ? "Modifier" : "Créer"}
        />
      </footer>
    </form>
  );
});

Form.displayName = "Form";

export default Form;
