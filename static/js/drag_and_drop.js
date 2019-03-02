// Credit : https://openclassrooms.com/fr/courses/1916641-dynamisez-vos-sites-web-avec-javascript/1922434-le-drag-drop

function drag_and_drop(apply_skills_boxes) { // x is an empty array from the method_store array in data_loader.js
  var dndHandler = {
    draggedElement: null, // Propriété pointant vers l'élément en cours de déplacement

    applyDragEvents: function(element) {
      element.draggable = true;
      var dndHandler = this; // Cette variable est nécessaire pour que l'événement "dragstart" ci-dessous accède facilement au namespace "dndHandler"
      element.addEventListener('dragstart', function(e) {
        dndHandler.draggedElement = e.target; // On sauvegarde l'élément en cours de déplacement
        e.dataTransfer.setData('text/plain', ''); // Nécessaire pour Firefox
      }, false);
    },

    applyDropEvents: function(dropper) {
      dropper.addEventListener('dragover', function(e) {
        e.preventDefault(); // On autorise le drop d'éléments
        this.className = 'dropper drop_hover'; // Et on applique le design adéquat à notre zone de drop quand un élément la survole
      }, false);
      dropper.addEventListener('dragleave', function() {
        this.className = 'dropper'; // On revient au design de base lorsque l'élément quitte la zone de drop
      });
      var dndHandler = this; // Cette variable est nécessaire pour que l'événement "drop" ci-dessous accède facilement au namespace "dndHandler"
      dropper.addEventListener('drop', function(e) {
        var target = e.target,
          draggedElement = dndHandler.draggedElement, // Récupération de l'élément concerné
          clonedElement = draggedElement.cloneNode(true); // On créé immédiatement le clone de cet élément
        while (target.className.indexOf('dropper') == -1) { // Cette boucle permet de remonter jusqu'à la zone de drop parente
          target = target.parentNode;
        }

        target.className = 'dropper'; // Application du design par défaut
        clonedElement = target.appendChild(clonedElement); // Ajout de l'élément cloné à la zone de drop actuelle
        draggedElement.parentNode.removeChild(draggedElement); // Suppression de l'élément d'origine
        dndHandler.applyDragEvents(clonedElement); // Nouvelle application des événements qui ont été perdus lors du cloneNode()
      });
    }
  };

  var elements = document.querySelectorAll('.draggable'),
    elementsLen = elements.length;
  for (var i = 0; i < elementsLen; i++) {
    dndHandler.applyDragEvents(elements[i]); // Application des paramètres nécessaires aux élément déplaçables
  }
  var droppers = document.querySelectorAll('.dropper'),
    droppersLen = droppers.length;
  for (var i = 0; i < droppersLen; i++) {
    //console.log(apply_skills_boxes)
    //if (droppers[i].getAttribute("id").includes("skills_box_") !== apply_skills_boxes){ // If the attribute is a skills_box_ from the timeline
      //console.log(i,droppers[i].getAttribute("id"))//
    //} else {
    dndHandler.applyDropEvents(droppers[i]); // Application des événements nécessaires aux zones de drop
  //}
  }
}
