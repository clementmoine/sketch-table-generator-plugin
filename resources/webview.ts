/**
 * Represents a generator for a table.
 * @typedef {Object} Generator
 * @property {HTMLElement} generator - The container for the table.
 * @property {number} rowCount - The number of rows in the table.
 * @property {number} colCount - The number of columns in the table.
 */

/**
 * Resets the generator when the mouse leaves the container.
 */
function resetGenerator() {
  if (h1) {
    h1.innerText = "Insérer un tableau";

    document
      .querySelectorAll(".cell")
      .forEach((cell) => cell.classList.remove("active"));
  }
}

/**
 * Handles hover events on table cells.
 * @param {MouseEvent} event - The hover event.
 */
function handleHover(event: MouseEvent) {
  const cell = (event.target as HTMLElement).closest<HTMLElement>(".cell");

  if (!cell) return;

  const rowIndex = Number(cell.dataset.row);
  const colIndex = Number(cell.dataset.col);

  document.querySelectorAll<HTMLElement>(".cell").forEach((cell) => {
    const cellColIndex = Number(cell.dataset.col);
    const cellRowIndex = Number(cell.dataset.row);

    if (cellColIndex <= colIndex && cellRowIndex <= rowIndex) {
      cell.classList.add("active");
    } else {
      cell.classList.remove("active");
    }
  });

  if (h1) {
    h1.innerText = `Tableau ${rowIndex + 1}x${colIndex + 1}`;
  }
}

/**
 * Handles click events on table cells.
 * @param {MouseEvent} event - The click event.
 */
function handleClick(event: MouseEvent) {
  const cell = Array.from(document.querySelectorAll<HTMLElement>(".cell.active")).pop();

  if (!cell) return;

  const rowIndex = Number(cell.dataset.row);
  const colIndex = Number(cell.dataset.col);

  const colWidth = Number((document.getElementById('col-width') as HTMLInputElement)?.value) ?? 250;

  window.postMessage("nativeLog", JSON.stringify({
    rowCount: rowIndex + 1,
    colCount: colIndex + 1,
    colWidth,
  }));
}

type GeneratorOptions = {
  rowCount: number,
  colCount: number
}

/**
 * Creates a table generator with the specified number of rows and columns.
 * @param {Object} options - The options for the generator.
 * @param {number} options.rowCount - The number of rows in the table.
 * @param {number} options.colCount - The number of columns in the table.
 */
function createGenerator(options: GeneratorOptions) {
  const { rowCount, colCount } = options
  
  if (!generator) {
    return null;
  }

  generator.addEventListener("mouseleave", resetGenerator);
  generator.addEventListener("click", handleClick);
  generator.addEventListener("mouseover", handleHover);

  for (let rowId = 0; rowId < rowCount; rowId++) {
    const row = document.createElement("tr");

    row.classList.add("row");
    row.dataset.row = rowId.toString();

    for (let colId = 0; colId < colCount; colId++) {
      const cell = document.createElement("td");
      const button = document.createElement("button");

      cell.classList.add("cell");
      cell.dataset.col = colId.toString();;
      cell.dataset.row = rowId.toString();;

      cell.appendChild(button);
      row.appendChild(cell);
    }

    generator.appendChild(row);
  }
}

const h1 = document.querySelector("h1");
const generator = document.getElementById("generator");

createGenerator({
  colCount: 10,
  rowCount: 8,
});
