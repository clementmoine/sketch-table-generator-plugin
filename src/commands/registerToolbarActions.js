import sketch from "sketch";

function registerToolbarActions() {
    sketch.Toolbar.addItem('myButton', {
        title: 'My Button',
        onClick: function() {
            // Affiche un message pour confirmer la création de la table
            UI.message(
                `Tableau de ${pluralize(rowCount, "ligne")} et ${pluralize(
                colCount,
                "colonne"
                )} inséré dans le document ! 👍`
            );
        },
      });
}

export default registerToolbarActions;